require "rails_helper"

RSpec.describe Households::AssignClient do
  it "creates a current membership" do
    household = create(:household)
    client = create(:client)

    membership = described_class.call(
      household: household,
      client: client,
      starts_at: Date.current,
    )

    expect(membership).to be_persisted
    expect(membership.household).to eq(household)
    expect(membership.client).to eq(client)
    expect(client.reload.household).to eq(household)
  end

  it "returns an invalid membership when the client already has a household" do
    household = create(:household)
    other = create(:household)
    client = create(:client)
    create(:households_client, household: household, client: client)

    membership = described_class.call(household: other, client: client)

    expect(membership).not_to be_persisted
    expect(membership.errors[:client_id]).to be_present
  end
end
