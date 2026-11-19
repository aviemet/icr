class ClientsAttendants::PersistedSerializer < ApplicationSerializer
  object_as :clients_attendant, model: "ClientsAttendant"
  include Persisted

  attributes(
    :client_id,
    :attendant_id,
    :starts_at,
    :ends_at,
  )

  belongs_to :attendant, serializer: Employees::PersistedSerializer
  belongs_to :client, serializer: Clients::PersistedSerializer
end
