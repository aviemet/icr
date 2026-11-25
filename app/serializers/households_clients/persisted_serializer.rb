class HouseholdsClients::PersistedSerializer < ApplicationSerializer
  object_as :households_client, model: "HouseholdsClient"
  include Persisted

  attributes(
    :household_id,
    :client_id,
    :starts_at,
    :ends_at,
  )

  belongs_to :client, serializer: Clients::PersistedSerializer
end
