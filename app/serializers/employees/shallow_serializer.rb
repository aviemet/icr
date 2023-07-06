class Employees::ShallowSerializer < ApplicationSerializer
  object_as :employee

  attributes(
    :number,
    :settings,
    :created_at,
    :updated_at,
  )
end
