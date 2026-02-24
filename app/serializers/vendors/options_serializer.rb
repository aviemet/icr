class Vendors::OptionsSerializer < ApplicationSerializer
  object_as :vendor, model: "Vendor"

  include Persisted

  attributes(
    :slug,
    :name,
  )
end
