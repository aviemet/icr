class Roles::ShowSerializer < RoleSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
