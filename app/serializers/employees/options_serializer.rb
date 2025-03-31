class Employees::OptionsSerializer < ApplicationSerializer
  object_as :employee, model: :Employee

  include Persisted
  include PersonFields
  include ColorMappingFields

  attributes(
    :slug,
    :number,
    :active_at,
    :inactive_at,
  )
end
