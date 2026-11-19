class Employee::SupportContacts::PersistedSerializer < Employee::SupportContactSerializer
  include Persisted

  has_one :person, serializer: People::ShowSerializer
end
