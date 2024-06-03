class Clients::ShowSerializer < ClientSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
