class Dosages::IndexSerializer < DosageSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
