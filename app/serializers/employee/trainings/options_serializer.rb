class Employee::Trainings::OptionsSerializer < ApplicationSerializer
  object_as :training, model: "Employee::Training"

  include Persisted

  attributes(
    :id,
    :name,
  )
end
