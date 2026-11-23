class Compliance::FormSubmissions::ShowSerializer < Compliance::FormSubmissions::PersistedSerializer
  belongs_to :form_template, serializer: Compliance::FormTemplates::ShowSerializer

  has_many :form_answers, serializer: Compliance::FormAnswers::PersistedSerializer
  has_many :corrective_actions, serializer: Compliance::CorrectiveActions::PersistedSerializer
end
