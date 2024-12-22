class Users::InertiaShareSerializer < Users::PersistedSerializer
  attributes(
    :id,
    :created_at,
    :updated_at,
    user_preferences: { type: "UserPreferences" },
    table_preferences: { type: "TablePreferences" },
  )

  has_many :roles, serializer: RoleSerializer
end
