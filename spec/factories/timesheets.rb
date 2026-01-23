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
FactoryBot.define do
  factory :timesheet do
    pay_period_start { Date.current.beginning_of_month }
    pay_period_end { Date.current.end_of_month }

    employee
  end
end
