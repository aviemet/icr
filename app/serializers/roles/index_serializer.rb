class Roles::IndexSerializer < RoleSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
