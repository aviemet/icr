class Clients::ShowSerializer < ClientSerializer
  attributes(
    :slug,
    :id,
    :updated_at,
    :created_at,
  )
end
