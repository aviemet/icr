class Households::SpotlightSerializer < SpotlightSerializer
  SPOTLIGHT_TYPE = "household".freeze

  object_as :household, model: "Household"

  attributes(
    :slug,
    :name,
  )
end
