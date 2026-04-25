class Shifts::EmployeeSerializer < ShiftSerializer
  delegate :employee, to: :@object

  belongs_to :employee, serializer: Employees::PersistedSerializer
end
