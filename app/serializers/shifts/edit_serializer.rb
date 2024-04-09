class Shifts::EditSerializer < ShiftSerializer

  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
