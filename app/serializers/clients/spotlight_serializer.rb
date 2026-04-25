class Clients::SpotlightSerializer < SpotlightSerializer
  SPOTLIGHT_TYPE = "client"

  object_as :client, model: :Client

  include PersonFields

  attributes(:slug)
end

