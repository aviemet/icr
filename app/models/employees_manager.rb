# == Schema Information
#
# Table name: employees_managers
#
#  id          :uuid             not null, primary key
#  ends_at     :date
#  starts_at   :date             not null
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
class EmployeesManager < ApplicationRecord
  resourcify

  belongs_to :manager, class_name: "Employee"
  belongs_to :employee, class_name: "Employee"

  validates :starts_at, presence: true
  validates :manager_id, uniqueness: {
    scope: :employee_id,
    conditions: -> { where(ends_at: nil) },
    message: :manager_uniqueness
  }

  validate :manager_can_manage_employees
  validate :not_self_managed

  private

  def manager_can_manage_employees
    unless manager&.can_manage_employees?
      errors.add(:manager, :must_have_privileges)
    end
  end

  def not_self_managed
    if manager_id == employee_id
      errors.add(:base, :no_self_management)
    end
  end

  scope :includes_associated, -> { includes([:manager, :employee]) }
end
