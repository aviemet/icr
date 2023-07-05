class Clients::ShallowSerializer < ApplicationSerializer
  object_as :client

  attributes(
    :id,
    :number,
    :created_at,
    :updated_at,
  )
end
