class UserSerializer < ApplicationSerializer
  object_as :user

  attributes(
    :email,
    :created_at,
    :updated_at,
  )

end
