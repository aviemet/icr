class Dosages::ShowSerializer < DosageSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
