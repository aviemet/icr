class Shifts::ShowSerializer < ShiftSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
