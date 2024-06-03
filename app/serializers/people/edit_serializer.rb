class People::EditSerializer < PersonSerializer

  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
