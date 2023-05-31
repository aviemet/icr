class EmployeeSerializer < ApplicationSerializer
  object_as :employee

  attributes(
    :number,
    :created_at,
    :updated_at,
  )

  belongs_to :person, serializer: PersonSerializer
end
