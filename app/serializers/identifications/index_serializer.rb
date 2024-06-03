class Identifications::IndexSerializer < IdentificationSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
