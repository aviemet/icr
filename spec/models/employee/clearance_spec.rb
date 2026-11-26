require "rails_helper"

# == Schema Information
#
# Table name: employee_clearances
#
#  id             :uuid             not null, primary key
#  clearance_type :integer          default("tb"), not null
#  cleared_on     :date
#  expires_on     :date
#  notes          :text
#  status         :integer          default("pending"), not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  employee_id    :uuid             not null
#
# Indexes
#
#  index_employee_clearances_on_employee_id  (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#
RSpec.describe Employee::Clearance do
  subject(:clearance) { build(:employee_clearance) }

  it { is_expected.to validate_presence_of(:clearance_type) }
  it { is_expected.to validate_presence_of(:status) }

  describe "#expiring_soon?" do
    it "is true when expires within 30 days" do
      clearance.expires_on = Date.current + 5.days
      expect(clearance).to be_expiring_soon
    end
  end
end
