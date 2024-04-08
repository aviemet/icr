class Users::IndexSerializer < UserSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
