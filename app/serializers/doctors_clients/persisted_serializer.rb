class DoctorsClients::PersistedSerializer < ApplicationSerializer
  object_as :doctors_client, model: "DoctorsClient"

  include Persisted

  attributes(
    :doctor_id,
    :client_id,
    :notes,
  )

  belongs_to :doctor, serializer: Doctors::PersistedSerializer
  belongs_to :client, serializer: Clients::PersistedSerializer
end
