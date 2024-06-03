class People::ShowSerializer < PersonSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
