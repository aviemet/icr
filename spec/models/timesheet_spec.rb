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

    it "is invalid with missing pay_period" do
      expect(build(:timesheet, pay_period: nil)).not_to be_valid
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:employee) }
    it { is_expected.to belong_to(:pay_period) }
    it { is_expected.to belong_to(:approved_by).class_name("User").optional }
    it { is_expected.to have_many(:shifts).dependent(:nullify) }
  end

  describe "creation via PayPeriod and Shift callbacks" do
    it "is created by PayPeriod backfill with correct pay_period and employee" do
      employee = create(:employee)
      period_start = 1.day.from_now.beginning_of_day
      period_end = 14.days.from_now.end_of_day
      event = create(:calendar_event, starts_at: period_start + 1.day, ends_at: period_start + 1.day + 2.hours)
      create(:shift, employee: employee, calendar_event: event)

      pay_period = PayPeriod.create!(starts_at: period_start, ends_at: period_end)

      timesheet = described_class.find_by(employee: employee, pay_period: pay_period)
      expect(timesheet).to be_present
      expect(timesheet.pay_period_id).to eq(pay_period.id)
      expect(timesheet.employee_id).to eq(employee.id)
    end

    it "receives shifts when created by PayPeriod backfill" do
      employee = create(:employee)
      period_start = 2.days.from_now.beginning_of_day
      period_end = 16.days.from_now.end_of_day
      event = create(:calendar_event, starts_at: period_start + 1.day, ends_at: period_start + 1.day + 2.hours)
      shift = create(:shift, employee: employee, calendar_event: event)

      pay_period = PayPeriod.create!(starts_at: period_start, ends_at: period_end)

      timesheet = described_class.find_by(employee: employee, pay_period: pay_period)
      expect(timesheet.shifts).to include(shift)
      expect(shift.reload.timesheet_id).to eq(timesheet.id)
    end
  end
end
