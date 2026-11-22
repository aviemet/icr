class Employee::Trainings::IndexSerializer < Employee::Trainings::PersistedSerializer
  has_many :clients, serializer: Clients::PersistedSerializer
end
