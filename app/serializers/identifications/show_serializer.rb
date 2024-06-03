class Identifications::ShowSerializer < IdentificationSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
