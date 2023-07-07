class EmployeeSerializer < ApplicationSerializer
  object_as :employee

  attributes(
    :number,
    :created_at,
    :updated_at,
    settings: { type: "EmployeeSettings"},
  )

  belongs_to :person, serializer: PersonSerializer
end
