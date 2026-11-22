# frozen_string_literal: true

require "rails_helper"

RSpec.describe Payroll::ShiftLastEditors do
  it "returns empty hash when there are no shifts" do
    expect(described_class.call([])).to eq({})
  end

  it "returns nil payload when the calendar event has never been updated" do
    shift = create(:shift)

    expect(described_class.call([shift])).to eq({})
  end

  it "returns the latest time editor for an updated calendar event" do
    user = create(:user)
    person = user.person
    person.update!(first_name: "Ada", last_name: "Lovelace")
    shift = create(:shift)
    event = shift.calendar_event

    PaperTrail.request(whodunnit: user.id) do
      event.update!(starts_at: event.starts_at + 1.hour, ends_at: event.ends_at + 1.hour)
    end

    result = described_class.call([shift])
    editor = result[event.id.to_s]

    expect(editor).to include(
      id: user.id.to_s,
      name: "Ada Lovelace",
      initials: "AL",
    )
    expect(editor[:edited_at]).to be_present
  end
end
