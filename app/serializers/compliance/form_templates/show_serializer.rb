class Compliance::FormTemplates::ShowSerializer < Compliance::FormTemplates::PersistedSerializer
  has_many :form_sections, serializer: Compliance::FormSections::PersistedSerializer
end
