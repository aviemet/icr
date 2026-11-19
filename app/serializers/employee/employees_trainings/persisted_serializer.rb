class Employee::EmployeesTrainings::PersistedSerializer < ApplicationSerializer
  object_as :employees_training, model: "Employee::EmployeesTraining"
  include Persisted

  attributes(
    :employee_id,
    :training_id,
    :started_at,
    :completed_at,
  )

  type :string, optional: false
  def status
    @object.status.to_s
  end

  belongs_to :training, serializer: Employee::Trainings::PersistedSerializer
end
