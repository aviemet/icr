class People::ShallowSerializer < ApplicationSerializer
  object_as :person

  attributes(
    :first_name,
    :middle_name,
    :last_name,
    :created_at,
    :updated_at,
    name: { type: :string },
  )
end
