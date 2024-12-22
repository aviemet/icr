class Clients::PersistedSerializer < ClientSerializer
  include Persisted

  attributes(
    :slug,
  )

  has_one :person, serializer: People::PersistedSerializer
end
