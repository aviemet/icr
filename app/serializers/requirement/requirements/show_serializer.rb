class Requirement::Requirements::ShowSerializer < Requirement::Requirements::PersistedSerializer
  type "string", optional: true
  def type_name
    @object.requirement_type&.name
  end

  type "string", optional: false
  delegate :scope_label, to: :@object

  has_many :requirement_items, serializer: Requirement::Items::PersistedSerializer

  type "string[]", optional: false
  def training_ids
    @object.training_ids.map(&:to_s)
  end

  type "string[]", optional: false
  def credential_types
    @object.credential_types.map(&:to_s)
  end
end
