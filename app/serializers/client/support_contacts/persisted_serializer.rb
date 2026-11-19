class Client::SupportContacts::PersistedSerializer < Client::SupportContactSerializer
  include Persisted

  has_one :person, serializer: People::ShowSerializer
end
