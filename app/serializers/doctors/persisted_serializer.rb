class Doctors::PersistedSerializer < DoctorSerializer
  include Persisted

  attributes(
    :slug,
  )

  has_one :person, serializer: People::PersistedSerializer
end
