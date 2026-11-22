# frozen_string_literal: true

require "rails_helper"

RSpec.describe Calendar::Recurring::ApplyOccurrenceEdit do
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

  it "splits the series for future edits" do
    occurrence = Time.zone.parse("2026-11-23 09:00")

    expect {
      described_class.call(
        event,
        attrs: {
          starts_at: Time.zone.parse("2026-11-23 11:00"),
          ends_at: Time.zone.parse("2026-11-23 19:00"),
          shift_attributes: { employee_id: employee.id },
        },
        edit_scope: "future",
        occurrence_starts_at: occurrence,
      )
    }.to change(Calendar::Event, :count).by(1)

    event.reload
    expect(event.recurring_patterns.sole.end_date).to eq(Date.parse("2026-11-22"))

    continuation = Calendar::Event.where.not(id: event.id).order(:created_at).last
    expect(continuation.starts_at).to eq(Time.zone.parse("2026-11-23 11:00"))
    expect(continuation.recurring_patterns.sole.day_of_week).to eq(occurrence.wday)
  end

  it "shifts the whole series when all is chosen with a date change" do
    occurrence = Time.zone.parse("2026-11-23 09:00")

    described_class.call(
      event,
      attrs: {
        starts_at: Time.zone.parse("2026-11-25 10:00"),
        ends_at: Time.zone.parse("2026-11-25 18:00"),
      },
      edit_scope: "all",
      occurrence_starts_at: occurrence,
    )

    event.reload
    expect(event.starts_at).to eq(Time.zone.parse("2026-11-18 10:00"))
    expect(event.ends_at).to eq(Time.zone.parse("2026-11-18 18:00"))
  end
end
