require "rails_helper"

RSpec.describe Shifts::ReviewSerializer do
  it "includes client name and slug from the calendar event" do
    client = create(:client)
    event = create(:calendar_event)
    event.clients << client
    shift = create(:shift, calendar_event: event)

    payload = shift.render(:review)

    expect(payload[:client_name]).to eq(client.full_name)
    expect(payload[:client_slug]).to eq(client.slug)
  end

  it "includes last_editor when set on the shift" do
    shift = create(:shift)
    editor = {
      id: SecureRandom.uuid,
      name: "Ada Lovelace",
      initials: "AL",
      edited_at: Time.current.iso8601,
    }
    shift.instance_variable_set(:@_last_editor, editor)

    payload = shift.render(:review)

    expect(payload[:last_editor]).to eq(editor)
  end

  it "includes null last_editor when unset" do
    shift = create(:shift)

    payload = shift.render(:review)

    expect(payload[:last_editor]).to be_nil
  end
end

