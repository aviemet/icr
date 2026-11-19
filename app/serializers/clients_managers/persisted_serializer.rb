class ClientsManagers::PersistedSerializer < ApplicationSerializer
  object_as :clients_manager, model: "ClientsManager"
  include Persisted

  attributes(
    :client_id,
    :manager_id,
    :starts_at,
    :ends_at,
  )

  belongs_to :manager, serializer: Employees::PersistedSerializer
end
