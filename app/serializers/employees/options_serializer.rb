class Employees::OptionsSerializer < ApplicationSerializer
  object_as :employee

  attributes(
    :id,
  )

  attribute :name do
    employee.person.name
  end
end
