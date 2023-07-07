class PersonSerializer < ApplicationSerializer
  object_as :person

  attributes(
    :first_name,
    :middle_name,
    :last_name,
    :created_at,
    :updated_at,
    name: { type: :string },
  )

  has_one :client, serializer: Clients::ShallowSerializer
  has_one :employee, serializer: Employees::ShallowSerializer
  has_one :user, serializer: UserSerializer
end
