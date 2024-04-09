class Shifts::IndexSerializer < ShiftSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
