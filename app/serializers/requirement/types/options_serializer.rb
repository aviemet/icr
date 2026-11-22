class Requirement::Types::OptionsSerializer < ApplicationSerializer
  object_as :requirement_type, model: "Requirement::Type"

  include Persisted

  attributes(
    :id,
    :name,
  )
end
