# == Schema Information
#
# Table name: timesheet_hours
#
#  id           :uuid             not null, primary key
#  ended_at     :datetime         not null
#  hours        :decimal(4, 2)    not null
#  started_at   :datetime         not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  employee_id  :uuid             not null
#  timesheet_id :uuid             not null
#
# Indexes
#
#  idx_timesheet_hours_unique_day         (timesheet_id,employee_id,started_at) UNIQUE
#  index_timesheet_hours_on_employee_id   (employee_id)
#  index_timesheet_hours_on_timesheet_id  (timesheet_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (timesheet_id => timesheets.id)
#
FactoryBot.define do
  factory :timesheet_hour do
    started_at { Time.current.beginning_of_day }
    ended_at { Time.current.beginning_of_day + 8.hours }
    hours { 8.0 }

    timesheet
    employee
  end
end
