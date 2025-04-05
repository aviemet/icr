class Calendar::Events::EmployeeSerializer < Calendar::Events::PersistedSerializer
  has_one :shift, serializer: Shifts::EmployeeSerializer
  has_many :clients, serializer: Clients::PersistedSerializer
end
