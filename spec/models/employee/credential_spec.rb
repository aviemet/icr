require "rails_helper"

# == Schema Information
#
# Table name: employee_credentials
#
#  id              :uuid             not null, primary key
#  credential_type :integer          default("cpr"), not null
#  expires_on      :date
#  issued_on       :date
#  name            :string           not null
#  notes           :text
#  number          :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  employee_id     :uuid             not null
#
# Indexes
#
#  index_employee_credentials_on_employee_id  (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#
RSpec.describe Employee::Credential do
  subject(:credential) { build(:employee_credential) }

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
