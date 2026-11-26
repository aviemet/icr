require "rails_helper"

RSpec.describe Shifts::ReviewSerializer do
  it "includes client name and slug from the calendar event" do
    client = instance_double(Client, full_name: "Ada Lovelace", slug: "ada-lovelace")
    event = instance_double(Calendar::Event, clients: [client])
    shift = build_shift(calendar_event: event)

    payload = described_class.render(shift)

    expect(payload[:client_name]).to eq(client.full_name)
    expect(payload[:client_slug]).to eq(client.slug)
  end

  it "includes last_editor when set on the shift" do
    shift = build_shift
    editor = {
      id: SecureRandom.uuid,
      name: "Ada Lovelace",
      initials: "AL",
      edited_at: Time.current.iso8601,
    }
    shift.instance_variable_set(:@_last_editor, editor)

    payload = described_class.render(shift)

    expect(payload[:last_editor]).to eq(editor)
  end

  it "includes null last_editor when unset" do
    shift = build_shift

    payload = described_class.render(shift)

    expect(payload[:last_editor]).to be_nil
  end

  def build_shift(calendar_event: instance_double(Calendar::Event, clients: []))
    instance_double(
      Shift,
      id: SecureRandom.uuid,
      new_record?: false,
      employee_id: nil,
      calendar_event_id: SecureRandom.uuid,
      service_type_id: SecureRandom.uuid,
      mileage: nil,
      service_type: nil,
      facilitator_approved_at: nil,
      ihss: false,
      starts_at: Time.current,
      ends_at: 8.hours.from_now,
      calendar_event: calendar_event,
      employee: nil,
      created_at: Time.current,
      updated_at: Time.current,
    )
  end
end
