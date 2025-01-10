class Employees::ShowSerializer < Employees::PersistedSerializer
  has_one :person, serializer: People::ShowSerializer
end
