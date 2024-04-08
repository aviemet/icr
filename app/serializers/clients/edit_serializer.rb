class Clients::EditSerializer < ClientSerializer

  attributes(
    :slug,
    :id,
    :updated_at,
    :created_at,
  )
end
