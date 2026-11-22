# frozen_string_literal: true

require "rails_helper"

RSpec.describe Calendar::Recurring::EndSeriesFrom do
  let(:client) { create(:client) }
  let(:employee) { create(:employee) }
  let(:shift_category) {
    Category.type("Calendar::Event").find_or_create_by!(name: "Shift") { |category| category.system = true }
  }
  let(:starts_at) { Time.zone.parse("2026-11-16 09:00") }
  let(:ends_at) { Time.zone.parse("2026-11-16 17:00") }
  let!(:event) do
    record = Calendar::Event.new(
      starts_at: starts_at,
      ends_at: ends_at,
      category_id: shift_category.id,
    )
    record.event_participants.build(participant_id: client.id, participant_type: "Client")
    record.build_shift(employee_id: employee.id)
    record.recurring_patterns.build(
      recurring_type: :weekly,
      offset: 1,
      day_of_week: 1,
      end_date: Date.parse("2026-12-31"),
    )
    record.save!
    record
  end

  it "truncates the series and returns truncated for a later occurrence" do
    occurrence = Time.zone.parse("2026-11-23 09:00")

    result = described_class.call(event, occurrence_starts_at: occurrence)

    expect(result).to eq(:truncated)
    expect(event.reload.recurring_patterns.sole.end_date).to eq(Date.parse("2026-11-22"))
    expect(Calendar::Event.exists?(event.id)).to be(true)
  end

  it "returns destroy when the occurrence is the series start" do
    result = described_class.call(event, occurrence_starts_at: starts_at)

    expect(result).to eq(:destroy)
    expect(event.reload.recurring_patterns.sole.end_date).to eq(Date.parse("2026-12-31"))
  end

  it "returns destroy when the event has no recurring patterns" do
    event.recurring_patterns.destroy_all

    result = described_class.call(event, occurrence_starts_at: Time.zone.parse("2026-11-23 09:00"))

    expect(result).to eq(:destroy)
  end

  it "requires occurrence_starts_at" do
    expect {
      described_class.call(event, occurrence_starts_at: nil)
    }.to raise_error(ArgumentError, "occurrence_starts_at is required")
  end
end
