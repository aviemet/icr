class Doctors::EditSerializer < Doctors::PersistedSerializer
  has_one :person, serializer: People::ShowSerializer
end
