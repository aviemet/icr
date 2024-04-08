class Users::EditSerializer < UserSerializer

  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
