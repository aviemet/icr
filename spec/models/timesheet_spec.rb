# == Schema Information
#
# Table name: timesheets
#
#  id               :uuid             not null, primary key
#  approved_at      :date
#  pay_period_end   :date             not null
#  pay_period_start :date             not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  approved_by_id   :uuid
#  employee_id      :uuid             not null
#
# Indexes
#
#  index_timesheets_on_approved_by_id  (approved_by_id)
#  index_timesheets_on_employee_id     (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (approved_by_id => users.id)
#  fk_rails_...  (employee_id => employees.id)
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
