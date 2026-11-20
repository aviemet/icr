class Caseloads::FacilitatorSerializer < ApplicationSerializer
  object_as :employee, model: :Employee

  include Persisted
  include PersonFields

  attributes(
    :slug,
  )

  has_one :person, serializer: People::PersistedSerializer
end
