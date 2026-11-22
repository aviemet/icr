class Requirement::Requirements::FormDataSerializer < Requirement::RequirementSerializer
  type "string[]", optional: false
  def training_ids
    []
  end

  type "string[]", optional: false
  def credential_types
    []
  end
end
