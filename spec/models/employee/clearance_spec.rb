require "rails_helper"

RSpec.describe Employee::Clearance do
  subject(:clearance) { build(:employee_clearance) }

  it { is_expected.to belong_to(:employee) }
  it { is_expected.to validate_presence_of(:clearance_type) }
  it { is_expected.to validate_presence_of(:status) }

  describe "#expiring_soon?" do
    it "is true when expires within 30 days" do
      clearance.expires_on = Date.current + 5.days
      expect(clearance).to be_expiring_soon
    end
  end
end
