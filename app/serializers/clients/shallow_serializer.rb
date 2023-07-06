class Clients::ShallowSerializer < ApplicationSerializer
  object_as :client

  attributes(
    :id,
    :number,
    :settings,
    :created_at,
    :updated_at,
  )
end
