# == Schema Information
#
# Table name: payroll_adjustments
#
#  id            :uuid             not null, primary key
#  change_set    :jsonb            not null
#  reason        :text             not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  employee_id   :uuid
#  pay_period_id :uuid             not null
#  timesheet_id  :uuid
#  user_id       :uuid             not null
#
# Indexes
#
#  index_payroll_adjustments_on_employee_id    (employee_id)
#  index_payroll_adjustments_on_pay_period_id  (pay_period_id)
#  index_payroll_adjustments_on_timesheet_id   (timesheet_id)
#  index_payroll_adjustments_on_user_id        (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (pay_period_id => pay_periods.id)
#  fk_rails_...  (timesheet_id => timesheets.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :payroll_adjustment, class: "Payroll::Adjustment" do
    pay_period
    user
    reason { "Correct approved hours after finalization" }
    change_set { { "total_regular_hours" => { "before" => 40, "after" => 38 } } }
  end
end
