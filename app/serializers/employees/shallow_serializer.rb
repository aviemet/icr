class Employees::ShallowSerializer < ApplicationSerializer
  object_as :employee

  attributes(
    :number,
    :created_at,
    :updated_at,
    settings: { type: "EmployeeSettings"},
  )
end
