class Clients::AttendantsController < Clients::BaseController
  expose :clients_attendant, model: ClientsAttendant, scope: -> { client.clients_attendants }

  strong_params :clients_attendant, permit: [:attendant_id, :starts_at]

  # @route POST /clients/:client_slug/attendants (client_attendants)
  def create
    authorize_client_update!
    clients_attendant.assign_attributes(clients_attendant_params)

    clients_attendant.save
    redirect_to_client_tab("care")
  end

  # @route PATCH /clients/:client_slug/attendants/:id (client_attendant)
  # @route PUT /clients/:client_slug/attendants/:id (client_attendant)
  def update
    authorize_client_update!

    clients_attendant.update(clients_attendant_params)
    redirect_to_client_tab("care")
  end

  # @route DELETE /clients/:client_slug/attendants/:id (client_attendant)
  def destroy
    authorize_client_update!
    clients_attendant.destroy!
    redirect_to_client_tab("care")
  end
end
