class Calendar::Events::ClientSerializer < Calendar::Events::PersistedSerializer
  has_one :shift, serializer: Shifts::ClientSerializer
end
