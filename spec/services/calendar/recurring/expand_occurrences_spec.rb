# frozen_string_literal: true

require "rails_helper"

RSpec.describe Calendar::Recurring::ExpandOccurrences do
  def expand(event, range_start, range_end)
    described_class.call(event:, range_start:, range_end:)
  end

  it "returns the master window for a non-recurring event that overlaps the range" do
    event = create(
      :calendar_event,
      starts_at: Time.zone.local(2026, 11, 20, 9, 0, 0),
      ends_at: Time.zone.local(2026, 11, 20, 17, 0, 0),
    )

    result = expand(
      event,
      Time.zone.local(2026, 11, 16).beginning_of_day,
      Time.zone.local(2026, 11, 30).end_of_day,
    )

    expect(result.length).to eq(1)
    expect(result.first.recurring).to be(false)
    expect(result.first.starts_at).to eq(event.starts_at)
    expect(result.first.ends_at).to eq(event.ends_at)
  end

  it "excludes a non-recurring event outside the range" do
    event = create(
      :calendar_event,
      starts_at: Time.zone.local(2026, 10, 1, 9, 0, 0),
      ends_at: Time.zone.local(2026, 10, 1, 17, 0, 0),
    )

    result = expand(
      event,
      Time.zone.local(2026, 11, 16).beginning_of_day,
      Time.zone.local(2026, 11, 30).end_of_day,
    )

    expect(result).to eq([])
  end

  it "expands weekly patterns into the visible range" do
    event = create(
      :calendar_event,
      starts_at: Time.zone.local(2026, 10, 1, 9, 0, 0),
      ends_at: Time.zone.local(2026, 10, 1, 17, 0, 0),
    )
    create(
      :calendar_recurring_pattern,
      calendar_event: event,
      recurring_type: :weekly,
      offset: 1,
      day_of_week: 1,
      end_date: nil,
      max_occurrences: nil,
    )
    event.reload

    result = expand(
      event,
      Time.zone.local(2026, 11, 16).beginning_of_day,
      Time.zone.local(2026, 11, 30).end_of_day,
    )

    starts = result.map(&:starts_at)
    expect(starts).to include(
      Time.zone.local(2026, 11, 16, 9, 0, 0),
      Time.zone.local(2026, 11, 23, 9, 0, 0),
      Time.zone.local(2026, 11, 30, 9, 0, 0),
    )
    expect(result.map(&:ends_at)).to include(Time.zone.local(2026, 11, 16, 17, 0, 0))
    expect(result).to all(have_attributes(recurring: true))
  end

  it "expands daily patterns every N days up to max_occurrences" do
    event = create(
      :calendar_event,
      starts_at: Time.zone.local(2026, 11, 16, 9, 0, 0),
      ends_at: Time.zone.local(2026, 11, 16, 10, 0, 0),
    )
    create(
      :calendar_recurring_pattern,
      calendar_event: event,
      recurring_type: :daily,
      offset: 2,
      day_of_week: nil,
      end_date: nil,
      max_occurrences: 4,
    )
    event.reload

    result = expand(
      event,
      Time.zone.local(2026, 11, 16).beginning_of_day,
      Time.zone.local(2026, 11, 30).end_of_day,
    )

    expect(result.map(&:starts_at)).to eq([
      Time.zone.local(2026, 11, 16, 9, 0, 0),
      Time.zone.local(2026, 11, 18, 9, 0, 0),
      Time.zone.local(2026, 11, 20, 9, 0, 0),
      Time.zone.local(2026, 11, 22, 9, 0, 0),
    ])
  end

  it "expands monthly day-of-month patterns" do
    event = create(
      :calendar_event,
      starts_at: Time.zone.local(2026, 1, 15, 9, 0, 0),
      ends_at: Time.zone.local(2026, 1, 15, 10, 0, 0),
    )
    create(
      :calendar_recurring_pattern,
      calendar_event: event,
      recurring_type: :monthly,
      offset: 1,
      day_of_week: nil,
      day_of_month: 15,
      end_date: nil,
      max_occurrences: 3,
    )
    event.reload

    result = expand(
      event,
      Time.zone.local(2026, 1, 1).beginning_of_day,
      Time.zone.local(2026, 4, 1).beginning_of_day,
    )

    expect(result.map { |row| row.starts_at.to_date }).to eq([
      Date.new(2026, 1, 15),
      Date.new(2026, 2, 15),
      Date.new(2026, 3, 15),
    ])
  end

  it "expands yearly patterns" do
    event = create(
      :calendar_event,
      starts_at: Time.zone.local(2024, 11, 16, 9, 0, 0),
      ends_at: Time.zone.local(2024, 11, 16, 10, 0, 0),
    )
    create(
      :calendar_recurring_pattern,
      calendar_event: event,
      recurring_type: :yearly,
      offset: 1,
      day_of_week: nil,
      month_of_year: 11,
      day_of_month: 16,
      end_date: nil,
      max_occurrences: 3,
    )
    event.reload

    result = expand(
      event,
      Time.zone.local(2024, 1, 1).beginning_of_day,
      Time.zone.local(2027, 1, 1).beginning_of_day,
    )

    expect(result.map(&:starts_at)).to eq([
      Time.zone.local(2024, 11, 16, 9, 0, 0),
      Time.zone.local(2025, 11, 16, 9, 0, 0),
      Time.zone.local(2026, 11, 16, 9, 0, 0),
    ])
  end

  it "hides cancelled occurrences" do
    event = create(
      :calendar_event,
      starts_at: Time.zone.local(2026, 11, 16, 9, 0, 0),
      ends_at: Time.zone.local(2026, 11, 16, 17, 0, 0),
    )
    create(
      :calendar_recurring_pattern,
      calendar_event: event,
      recurring_type: :weekly,
      offset: 1,
      day_of_week: 1,
      end_date: nil,
      max_occurrences: nil,
    )
    create(
      :calendar_event_exception,
      calendar_event: event,
      cancelled: Time.zone.local(2026, 11, 23, 9, 0, 0),
      rescheduled: nil,
    )
    event.reload

    result = expand(
      event,
      Time.zone.local(2026, 11, 16).beginning_of_day,
      Time.zone.local(2026, 11, 30).end_of_day,
    )

    expect(result.map(&:starts_at)).not_to include(Time.zone.local(2026, 11, 23, 9, 0, 0))
    expect(result.map(&:starts_at)).to include(Time.zone.local(2026, 11, 16, 9, 0, 0))
  end

  it "applies rescheduled exception display times" do
    event = create(
      :calendar_event,
      starts_at: Time.zone.local(2026, 11, 16, 9, 0, 0),
      ends_at: Time.zone.local(2026, 11, 16, 17, 0, 0),
    )
    create(
      :calendar_recurring_pattern,
      calendar_event: event,
      recurring_type: :weekly,
      offset: 1,
      day_of_week: 1,
      end_date: nil,
      max_occurrences: nil,
    )
    create(
      :calendar_event_exception,
      calendar_event: event,
      cancelled: nil,
      rescheduled: Time.zone.local(2026, 11, 23, 9, 0, 0),
      starts_at: Time.zone.local(2026, 11, 23, 11, 0, 0),
      ends_at: Time.zone.local(2026, 11, 23, 15, 0, 0),
    )
    event.reload

    result = expand(
      event,
      Time.zone.local(2026, 11, 16).beginning_of_day,
      Time.zone.local(2026, 11, 30).end_of_day,
    )
    moved = result.find { |row| row.original_starts_at == Time.zone.local(2026, 11, 23, 9, 0, 0) }

    expect(moved.starts_at).to eq(Time.zone.local(2026, 11, 23, 11, 0, 0))
    expect(moved.ends_at).to eq(Time.zone.local(2026, 11, 23, 15, 0, 0))
  end
end
