class Clients::IndexSerializer < Clients::PersistedSerializer
  has_one :household, serializer: Households::PersistedSerializer
end
