class Households::OptionsSerializer < ApplicationSerializer
  object_as :household, model: "Household"

  include Persisted

  attributes(
    :slug,
    :name,
  )
end
