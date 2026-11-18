require "rails_helper"

RSpec.describe "PaperTrail", type: :model do
  it "records create and update versions with whodunnit" do
    user = create(:user)

    pay_period = nil
    PaperTrail.request(whodunnit: user.id) do
      pay_period = create(:pay_period, finalized_at: nil, approved_at: nil)
      pay_period.update!(approved_at: Time.current)
    end

    create_version = pay_period.versions.find_by!(event: "create")
    update_version = pay_period.versions.where(event: "update").last

    expect(create_version.whodunnit).to eq(user.id.to_s)
    expect(update_version.whodunnit).to eq(user.id.to_s)
    expect(update_version.created_at).to be_present
  end
end
