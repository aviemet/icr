class Caseloads::ClientSerializer < ApplicationSerializer
  object_as :client, model: :Client

  include Persisted
  include PersonFields

  attributes(
    :slug,
  )

  has_one :person, serializer: People::PersistedSerializer
end
