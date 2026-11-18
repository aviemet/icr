class Companies::EditSerializer < Companies::PersistedSerializer
  has_one :contact, serializer: Contacts::PersistedSerializer
end
