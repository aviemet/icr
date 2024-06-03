class People::IndexSerializer < PersonSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
