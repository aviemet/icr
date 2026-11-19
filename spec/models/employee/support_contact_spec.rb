require "rails_helper"

RSpec.describe Employee::SupportContact do
  subject(:support_contact) { build(:employee_support_contact) }

  it { is_expected.to belong_to(:employee) }
  it { is_expected.to belong_to(:person) }
  it { is_expected.to validate_numericality_of(:priority).only_integer.is_greater_than(0) }

  it "persists with emergency relationship" do
    support_contact.save!
    expect(support_contact).to be_relationship_emergency
    expect(support_contact.is_emergency).to be(true)
  end
end
