class Shifts::ReviewSerializer < ShiftSerializer
  include Persisted

  attributes(
    :starts_at,
    :ends_at,
  )
end
