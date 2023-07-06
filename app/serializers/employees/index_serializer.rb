class Employees::IndexSerializer < ApplicationSerializer
  object_as :employee

  attributes(
    :id,
    :number,
    :settings,
    :created_at,
    :updated_at,
  )

  belongs_to :person, serializer: PersonSerializer
end
