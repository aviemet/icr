class Calendar::Events::HouseholdSerializer < Calendar::Events::PersistedSerializer
  has_one :shift, serializer: Shifts::ClientSerializer
  has_many :clients, serializer: Clients::PersistedSerializer
end
