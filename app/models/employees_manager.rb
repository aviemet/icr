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
