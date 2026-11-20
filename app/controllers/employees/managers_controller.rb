class Employees::ManagersController < Employees::BaseController
  expose :employees_manager, model: Employee::EmployeesManager, scope: -> { employee.managers_employees_managers }

  strong_params :employees_manager, permit: [:manager_id, :starts_at, :ends_at, :primary]

  # @route POST /employees/:employee_slug/managers (employee_managers)
  def create
    authorize_employee_update!
    employees_manager.assign_attributes(employees_manager_params)
    employees_manager.save
    redirect_to_employee_tab("assignments")
  end

  # @route PATCH /employees/:employee_slug/managers/:id (employee_manager)
  # @route PUT /employees/:employee_slug/managers/:id (employee_manager)
  def update
    authorize_employee_update!
    employees_manager.update(employees_manager_params)
    redirect_to_employee_tab("assignments")
  end

  # @route DELETE /employees/:employee_slug/managers/:id (employee_manager)
  def destroy
    authorize_employee_update!
    employees_manager.destroy!
    redirect_to_employee_tab("assignments")
  end
end
