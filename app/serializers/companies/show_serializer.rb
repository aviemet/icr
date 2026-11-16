class Companies::ShowSerializer < Companies::PersistedSerializer
  has_one :contact, serializer: Contacts::PersistedSerializer
end
