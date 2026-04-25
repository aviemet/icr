class Households::SpotlightSerializer < SpotlightSerializer
  SPOTLIGHT_TYPE = "household"

  object_as :household, model: "Household"

  attributes(
    :slug,
    :name,
  )
end

