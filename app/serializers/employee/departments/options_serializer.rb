class Employee::Departments::OptionsSerializer < ApplicationSerializer
  object_as :department, model: "Employee::Department"

  include Persisted

  attributes(
    :slug,
    :name,
  )
end
