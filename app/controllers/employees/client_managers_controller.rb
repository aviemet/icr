class Employees::ClientManagersController < Employees::BaseController
  expose :clients_manager, model: ClientsManager, scope: -> { employee.clients_managers }

  strong_params :clients_manager, permit: [:client_id, :starts_at, :ends_at]

  # @route POST /employees/:employee_slug/client_managers (employee_client_managers)
  def create
    authorize_employee_update!
    clients_manager.assign_attributes(clients_manager_params)
    clients_manager.manager = employee
    clients_manager.save
    redirect_to_employee_tab("assignments")
  end

  # @route PATCH /employees/:employee_slug/client_managers/:id (employee_client_manager)
  # @route PUT /employees/:employee_slug/client_managers/:id (employee_client_manager)
  def update
    authorize_employee_update!
    clients_manager.update(clients_manager_params)
    redirect_to_employee_tab("assignments")
  end

  # @route DELETE /employees/:employee_slug/client_managers/:id (employee_client_manager)
  def destroy
    authorize_employee_update!
    clients_manager.destroy!
    redirect_to_employee_tab("assignments")
  end
end
