class Requirement::Requirements::IndexSerializer < Requirement::Requirements::PersistedSerializer
  type "string", optional: true
  def type_name
    @object.requirement_type&.name
  end

  type "string", optional: false
  delegate :scope_label, to: :@object

  type "number", optional: false
  def trainings_count
    @object.requirement_items.trainings.size
  end

  type "number", optional: false
  def credentials_count
    @object.requirement_items.credentials.size
  end
end
