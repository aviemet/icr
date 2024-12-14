# == Schema Information
#
# Table name: employee_pay_rates
#
#  id            :uuid             not null, primary key
#  ends_at       :date
#  starts_at     :date
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  employee_id   :uuid             not null
#  pay_rate_id   :uuid             not null
#  shift_type_id :uuid             not null
#
# Indexes
#
#  index_employee_pay_rates_on_employee_id    (employee_id)
#  index_employee_pay_rates_on_pay_rate_id    (pay_rate_id)
#  index_employee_pay_rates_on_shift_type_id  (shift_type_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (pay_rate_id => pay_rates.id)
#  fk_rails_...  (shift_type_id => shift_types.id)
#
require 'rails_helper'

RSpec.describe EmployeePayRate do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:employee_pay_rate)).to be_valid
    end

    it 'is invlalid with missing attributes' do
      %i(starts_at).each do |attr|
        expect(build(:employee_pay_rate, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it{ is_expected.to belong_to(:employee) }
    it{ is_expected.to belong_to(:pay_rate) }
    it{ is_expected.to belong_to(:shift_type) }
  end
end
