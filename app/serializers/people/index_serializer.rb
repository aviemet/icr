class People::IndexSerializer < People::PersistedSerializer
  belongs_to :user, serializer: Users::PersistedSerializer
  belongs_to :client, serializer: Clients::PersistedSerializer
  belongs_to :employee, serializer: Employees::PersistedSerializer
end
