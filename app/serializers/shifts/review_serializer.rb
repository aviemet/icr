class Shifts::ReviewSerializer < ShiftSerializer
  attributes(
    :starts_at,
    :ends_at,
  )
end
