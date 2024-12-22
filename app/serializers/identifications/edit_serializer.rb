class Identifications::EditSerializer < IdentificationSerializer

  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
