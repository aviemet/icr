class Clients::TrainingsController < Clients::BaseController
  expose :clients_training, model: ClientsTraining, scope: -> { client.clients_trainings }

  strong_params :clients_training, permit: [:training_id, :required]

  # @route POST /clients/:client_slug/trainings (client_trainings)
  def create
    authorize_client_update!
    clients_training.assign_attributes(clients_training_params)
    clients_training.save
    redirect_to_client_tab("trainings")
  end

  # @route PATCH /clients/:client_slug/trainings/:id (client_training)
  # @route PUT /clients/:client_slug/trainings/:id (client_training)
  def update
    authorize_client_update!
    clients_training.update(clients_training_params)
    redirect_to_client_tab("trainings")
  end

  # @route DELETE /clients/:client_slug/trainings/:id (client_training)
  def destroy
    authorize_client_update!
    clients_training.destroy!
    redirect_to_client_tab("trainings")
  end
end
