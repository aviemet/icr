# frozen_string_literal: true

require "rails_helper"

RSpec.describe Calendar::Recurring::TruncateSeriesBefore do
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
      max_occurrences: 20,
    )
    record.save!
    record
  end

  it "sets end_date to the day before the occurrence and clears max_occurrences" do
    occurrence = Time.zone.parse("2026-11-23 09:00")

    described_class.call(event, occurrence_starts_at: occurrence)

    pattern = event.reload.recurring_patterns.sole
    expect(pattern.end_date).to eq(Date.parse("2026-11-22"))
    expect(pattern.max_occurrences).to be_nil
  end

  it "keeps an earlier existing end_date" do
    event.recurring_patterns.sole.update!(end_date: Date.parse("2026-11-20"))
    occurrence = Time.zone.parse("2026-11-23 09:00")

    described_class.call(event, occurrence_starts_at: occurrence)

    expect(event.reload.recurring_patterns.sole.end_date).to eq(Date.parse("2026-11-20"))
  end
end
