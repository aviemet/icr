class Vendors::SpotlightSerializer < SpotlightSerializer
  SPOTLIGHT_TYPE = "vendor"

  object_as :vendor, model: "Vendor"

  attributes(
    :slug,
    :name,
  )
end

