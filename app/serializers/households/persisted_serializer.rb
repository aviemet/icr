class Households::PersistedSerializer < HouseholdSerializer
  include Persisted

  attributes(
    :slug,
  )
end
