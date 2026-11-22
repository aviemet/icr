class Requirement::Items::PersistedSerializer < ApplicationSerializer
  object_as :requirement_item, model: "Requirement::Item"

  include Persisted

  attributes(
    :fulfillable_id,
    :fulfillable_type,
    :credential_type,
  )

  type "string", optional: false
  def name
    @object.display_name
  end

  type "string", optional: false
  def kind
    @object.credential? ? "credential" : "training"
  end
end
