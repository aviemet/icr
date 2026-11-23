class Compliance::FormSections::PersistedSerializer < Compliance::FormSectionSerializer
  include Persisted

  has_many :form_items, serializer: Compliance::FormItems::PersistedSerializer
end
