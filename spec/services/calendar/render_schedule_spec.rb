# frozen_string_literal: true

require "rails_helper"

RSpec.describe Calendar::RenderSchedule do
  it "expands weekly masters into occurrence payloads for the requested view" do
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
    create(:shift, calendar_event: event)
    event.reload

    payload = described_class.call(
      events: [event],
      range_start: Time.zone.local(2026, 11, 16).beginning_of_day,
      range_end: Time.zone.local(2026, 11, 30).end_of_day,
      view: :client,
    )

    expect(payload.length).to eq(3)
    expect(payload.pluck(:is_recurring)).to all(be(true))
    expect(payload.pluck(:master_id)).to all(eq(event.id))
    expect(payload.pluck(:starts_at)).to include(
      Time.zone.local(2026, 11, 16, 9, 0, 0),
      Time.zone.local(2026, 11, 23, 9, 0, 0),
      Time.zone.local(2026, 11, 30, 9, 0, 0),
    )
    expect(payload.first[:id].to_s).to include("#{event.id}__")
    expect(payload.first[:occurrence_starts_at]).to be_present
  end

  it "keeps non-recurring events as a single occurrence with is_recurring false" do
    event = create(
      :calendar_event,
      starts_at: Time.zone.local(2026, 11, 18, 9, 0, 0),
      ends_at: Time.zone.local(2026, 11, 18, 17, 0, 0),
    )
    create(:shift, calendar_event: event)

    payload = described_class.call(
      events: [event],
      range_start: Time.zone.local(2026, 11, 16).beginning_of_day,
      range_end: Time.zone.local(2026, 11, 30).end_of_day,
      view: :client,
    )

    expect(payload.length).to eq(1)
    expect(payload.first[:id]).to eq(event.id)
    expect(payload.first[:master_id]).to eq(event.id)
    expect(payload.first[:is_recurring]).to be(false)
    expect(payload.first[:starts_at]).to eq(event.starts_at)
  end
end
