class Caseloads::AssignmentSerializer < ApplicationSerializer
  object_as :clients_manager, model: :ClientsManager

  include Persisted

  attributes(
    :manager_id,
    :client_id,
    :starts_at,
    :ends_at,
  )
end
