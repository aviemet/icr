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
class Timesheet < ApplicationRecord
  include PgSearchable

  pg_search_config(
    against: [:pay_period_end, :pay_period_start, :approved_at],
    associated_against: { employee: [:name] },
  )

  tracked
  resourcify

  belongs_to :employee
  belongs_to :approved_by, class_name: "User", optional: true

  validates :pay_period_start, presence: true
  validates :pay_period_end, presence: true

  scope :includes_associated, -> { includes([]) }
end
