class Clients::EditSerializer < ClientSerializer

  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
