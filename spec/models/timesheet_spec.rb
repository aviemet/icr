# == Schema Information
#
# Table name: timesheets
#
#  id                  :uuid             not null, primary key
#  approval_snapshot   :jsonb            not null
#  approved_at         :date
#  status              :integer
#  total_ot_hours      :decimal(, )
#  total_pto_hours     :decimal(, )
#  total_regular_hours :decimal(, )
#  total_sick_hours    :decimal(, )
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  approved_by_id      :uuid
#  employee_id         :uuid             not null
#  pay_period_id       :uuid             not null
#
# Indexes
#
#  index_timesheets_on_approved_by_id  (approved_by_id)
#  index_timesheets_on_employee_id     (employee_id)
#  index_timesheets_on_pay_period_id   (pay_period_id)
#
# Foreign Keys
#
#  fk_rails_...  (approved_by_id => users.id)
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (pay_period_id => pay_periods.id)
#
require "rails_helper"

RSpec.describe Timesheet do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:timesheet)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(pay_period_start pay_period_end).each do |attr|
        expect(build(:timesheet, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:employee) }
    it { is_expected.to belong_to(:approved_by).class_name("User").optional }
  end
end
