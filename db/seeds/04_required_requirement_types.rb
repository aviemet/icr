[
  { name: "Onboarding", description: "Requirements for new hires and role starts" },
  { name: "Compliance", description: "Ongoing regulatory and agency compliance" },
  { name: "Certification", description: "Role or skill certifications" },
].each do |attributes|
  Requirement::Type.find_or_create_by!(name: attributes[:name]) do |record|
    record.description = attributes[:description]
  end
end

Rails.logger.info "[seeds] requirement types"
