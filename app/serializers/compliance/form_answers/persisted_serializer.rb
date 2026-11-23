class Compliance::FormAnswers::PersistedSerializer < Compliance::FormAnswerSerializer
  include Persisted

  belongs_to :form_item, serializer: Compliance::FormItems::PersistedSerializer
end
