class Employee::EmployeesTrainings::AssignmentSerializer < Employee::EmployeesTrainings::PersistedSerializer
  belongs_to :employee, serializer: Employees::PersistedSerializer
end
