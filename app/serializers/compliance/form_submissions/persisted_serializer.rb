class Compliance::FormSubmissions::PersistedSerializer < Compliance::FormSubmissionSerializer
  include Persisted

  belongs_to :form_template, serializer: Compliance::FormTemplates::PersistedSerializer
  belongs_to :household, serializer: Households::PersistedSerializer
  belongs_to :client, serializer: Clients::PersistedSerializer
  belongs_to :conducted_by, serializer: Employees::PersistedSerializer

  type "string", optional: false
  delegate :subject_label, to: :@object
end
