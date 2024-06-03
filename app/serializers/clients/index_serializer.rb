class Clients::IndexSerializer < ClientSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
