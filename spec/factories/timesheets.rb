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
FactoryBot.define do
  factory :timesheet do
    employee
    pay_period
  end
end
