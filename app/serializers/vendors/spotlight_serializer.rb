class Vendors::SpotlightSerializer < SpotlightSerializer
  SPOTLIGHT_TYPE = "vendor".freeze

  object_as :vendor, model: "Vendor"

  attributes(
    :slug,
    :name,
  )
end
