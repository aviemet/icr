class Requirement::Requirements::EditSerializer < Requirement::Requirements::PersistedSerializer
  type "string[]", optional: false
  def training_ids
    @object.training_ids.map(&:to_s)
  end

  type "string[]", optional: false
  def credential_types
    @object.credential_types.map(&:to_s)
  end
end
