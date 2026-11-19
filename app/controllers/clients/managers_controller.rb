class Clients::ManagersController < Clients::BaseController
  expose :clients_manager, model: ClientsManager, scope: -> { client.clients_managers }

  strong_params :clients_manager, permit: [:manager_id, :starts_at, :ends_at]

  # @route POST /clients/:client_slug/managers (client_managers)
  def create
    authorize_client_update!
    clients_manager.assign_attributes(clients_manager_params)

    clients_manager.save
    redirect_to_client_tab("care")
  end

  # @route PATCH /clients/:client_slug/managers/:id (client_manager)
  # @route PUT /clients/:client_slug/managers/:id (client_manager)
  def update
    authorize_client_update!

    clients_manager.update(clients_manager_params)
    redirect_to_client_tab("care")
  end

  # @route DELETE /clients/:client_slug/managers/:id (client_manager)
  def destroy
    authorize_client_update!
    clients_manager.destroy!
    redirect_to_client_tab("care")
  end
end
