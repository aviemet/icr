class Users::PersistedSerializer < UserSerializer
  include Persisted

  attributes(
    :slug,
  )

  has_one :person, serializer: People::PersistedSerializer
end
