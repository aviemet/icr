class Users::ShowSerializer < UserSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
