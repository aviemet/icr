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
end
