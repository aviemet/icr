class Households::EditSerializer < Households::PersistedSerializer
  has_one :contact, serializer: Contacts::PersistedSerializer
end
