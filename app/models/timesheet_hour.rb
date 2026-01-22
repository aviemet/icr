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
class TimesheetHour < ApplicationRecord
  include PgSearchable
  pg_search_config(against: [])

  tracked
  resourcify

  belongs_to :timesheet
  belongs_to :employee

  validates :started_at, presence: true
  validates :ended_at, presence: true
  validates :hours, presence: true
  validates :started_at, uniqueness: { scope: [:timesheet_id, :employee_id] }

  scope :includes_associated, -> { includes([]) }
end
