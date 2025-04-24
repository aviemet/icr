# == Schema Information
#
# Table name: employees_managers
#
#  id          :uuid             not null, primary key
#  ends_at     :datetime
#  primary     :boolean          default(FALSE), not null
#  starts_at   :datetime         not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  employee_id :uuid             not null
#  manager_id  :uuid             not null
#
# Indexes
#
#  index_employees_managers_on_employee_id       (employee_id)
#  index_employees_managers_on_manager_id        (manager_id)
#  index_employees_managers_unique_relationship  (manager_id,employee_id) UNIQUE WHERE (ends_at IS NULL)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (manager_id => employees.id)
#
class Employee::EmployeesManager < ApplicationRecord
  self.table_name = "employees_managers"
  resourcify

  belongs_to :manager, class_name: "Employee"
  belongs_to :employee, class_name: "Employee"

  attribute :starts_at, :datetime, default: -> { Time.current }

  validates :starts_at, presence: true
  validate :ends_at_after_starts_at, if: :ends_at?

  # Only allow 1 employee/manager relationship per pair of employees
  validates :manager_id, uniqueness: {
    scope: :employee_id,
    conditions: -> { where(ends_at: nil) },
    message: :manager_uniqueness
  }

  validate :not_self_managed

  scope :current, -> { where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)", Time.current, Time.current) }

  scope :includes_associated, -> { includes([:manager, :employee]) }

  private

  def not_self_managed
    if manager_id == employee_id
      errors.add(:base, :no_self_management)
    end
  end

  def ends_at_after_starts_at
    return if ends_at.blank?

    if ends_at < starts_at
      errors.add(:ends_at, "must be after starts_at")
    end
  end
end
