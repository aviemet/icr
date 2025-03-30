class Clients::OptionsSerializer < ApplicationSerializer
  object_as :client, model: :Client

  include Persisted
  include PersonFields
  include ColorMappingFields

  attributes(
    :slug,
    :number,
    :color,
    :active_at,
    :inactive_at,
  )
end
