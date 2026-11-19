class Employees::ClearancesController < Employees::BaseController
  expose :clearance, model: Employee::Clearance, scope: -> { employee.clearances }

  strong_params :clearance, permit: [
    :clearance_type, :status, :cleared_on, :expires_on, :notes,
  ]

  def create
    authorize_employee_update!
    clearance.assign_attributes(clearance_params)
    clearance.save
    redirect_to_employee_tab("credentials")
  end

  def update
    authorize_employee_update!
    clearance.update(clearance_params)
    redirect_to_employee_tab("credentials")
  end

  def destroy
    authorize_employee_update!
    clearance.destroy!
    redirect_to_employee_tab("credentials")
  end
end
