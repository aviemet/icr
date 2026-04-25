class Categories::OptionsSerializer < ApplicationSerializer
  object_as :category, model: "Category"

  include Persisted

  attributes(
    :name,
    :slug,
  )
end
