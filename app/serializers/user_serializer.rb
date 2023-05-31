class UserSerializer < ApplicationSerializer
  object_as :user

  attributes(
    :email,
    :created_at,
    :updated_at,
  )

  has_one :client, serializer: ClientSerializer
  has_one :employee, serializer: EmployeeSerializer
  has_one :user, serializer: UserSerializer
end
