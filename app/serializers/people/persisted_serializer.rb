class People::PersistedSerializer < PersonSerializer
  include Persisted

  attributes(
    :slug,
  )
end
