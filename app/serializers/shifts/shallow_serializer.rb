class Shifts::ShallowSerializer < ApplicationSerializer
  object_as :shift

  attributes(
    :starts_at,
    :ends_at,
    :title,
    :employee_id,
    :created_at,
    :updated_at,
  )
end
