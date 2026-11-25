class Households::FormDataSerializer < HouseholdSerializer
  has_one :contact, serializer: Contacts::PersistedSerializer
end
