class ClientsTrainings::ShowRowSerializer < ApplicationSerializer
  object_as :clients_training, model: "ClientsTraining"
  include Persisted

  attributes(
    :client_id,
    :training_id,
    :required,
  )

  belongs_to :training, serializer: Employee::Trainings::PersistedSerializer
end
