class Employee::Trainings::SpotlightSerializer < SpotlightSerializer
  SPOTLIGHT_TYPE = "training"

  object_as :training, model: "Employee::Training"

  attributes(
    :id,
    :name,
  )
end

