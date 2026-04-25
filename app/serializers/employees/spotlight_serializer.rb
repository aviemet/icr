class Employees::SpotlightSerializer < SpotlightSerializer
  SPOTLIGHT_TYPE = "employee"

  object_as :employee, model: :Employee

  include PersonFields

  attributes(:slug)
end

