class Clients::ShowSerializer < Clients::PersistedSerializer
  has_one :person, serializer: People::ShowSerializer
end
