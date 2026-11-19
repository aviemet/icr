require "rails_helper"

RSpec.describe Employee::Credential do
  subject(:credential) { build(:employee_credential) }

  it { is_expected.to belong_to(:employee) }
  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:credential_type) }

  describe "#expiring_soon?" do
    it "is true when expires within 30 days" do
      credential.expires_on = Date.current + 10.days
      expect(credential).to be_expiring_soon
    end

    it "is false when expires beyond 30 days" do
      credential.expires_on = Date.current + 60.days
      expect(credential).not_to be_expiring_soon
    end
  end
end
