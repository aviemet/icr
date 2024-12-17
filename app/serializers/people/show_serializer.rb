class People::ShowSerializer < People::PersistedSerializer
  belongs_to :contact, serializer: Contacts::PersistedSerializer
end
