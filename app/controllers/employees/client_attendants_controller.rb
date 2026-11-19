class Employees::ClientAttendantsController < Employees::BaseController
  expose :clients_attendant, model: ClientsAttendant, scope: -> { employee.clients_attendants }

  strong_params :clients_attendant, permit: [:client_id, :starts_at, :ends_at]

  def create
    authorize_employee_update!
    clients_attendant.assign_attributes(clients_attendant_params)
    clients_attendant.attendant = employee
    clients_attendant.save
    redirect_to_employee_tab("assignments")
  end

  def update
    authorize_employee_update!
    clients_attendant.update(clients_attendant_params)
    redirect_to_employee_tab("assignments")
  end

  def destroy
    authorize_employee_update!
    clients_attendant.destroy!
    redirect_to_employee_tab("assignments")
  end
end
