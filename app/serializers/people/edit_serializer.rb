class People::EditSerializer < PersonSerializer

  attributes(
    :slug,
    :id,
    :updated_at,
    :created_at,
  )
end
