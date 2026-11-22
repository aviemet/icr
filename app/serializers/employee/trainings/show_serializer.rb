class Employee::Trainings::ShowSerializer < Employee::Trainings::PersistedSerializer
  has_many :clients_trainings, serializer: ClientsTrainings::PersistedSerializer
  has_many :employees_trainings, serializer: Employee::EmployeesTrainings::AssignmentSerializer
end
