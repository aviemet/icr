class RegionalCenters::OptionsSerializer < ApplicationSerializer
  object_as :regional_center, model: "RegionalCenter"

  include Persisted

  attributes(
    :code,
    :name,
  )
end
