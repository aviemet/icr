class Employee::EmployeesManagers::PersistedSerializer < ApplicationSerializer
  object_as :employees_manager, model: "Employee::EmployeesManager"
  include Persisted

  attributes(
    :employee_id,
    :manager_id,
    :starts_at,
    :ends_at,
    :primary,
  )

  belongs_to :manager, serializer: Employees::PersistedSerializer
end
