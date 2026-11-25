require "rails_helper"

RSpec.describe Households::EndMembership do
  it "sets ends_at and moves the membership to history after the end date" do
    household = create(:household)
    client = create(:client)
    membership = create(
      :households_client,
      household: household,
      client: client,
      starts_at: 10.days.ago.to_date,
    )

    updated = described_class.call(membership: membership, ends_at: Date.yesterday)

    expect(updated.ends_at).to eq(Date.yesterday)
    expect(client.reload.household).to be_nil
    expect(household.past_memberships).to include(updated)
    expect(household.current_memberships).not_to include(updated)
  end
end
