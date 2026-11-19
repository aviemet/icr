class Employees::ManagersController < Employees::BaseController
  expose :employees_manager, model: Employee::EmployeesManager, scope: -> { employee.managers_employees_managers }

  strong_params :employees_manager, permit: [:manager_id, :starts_at, :ends_at, :primary]

  def create
    authorize_employee_update!
    employees_manager.assign_attributes(employees_manager_params)
    employees_manager.save
    redirect_to_employee_tab("assignments")
  end

  def update
    authorize_employee_update!
    employees_manager.update(employees_manager_params)
    redirect_to_employee_tab("assignments")
  end

  def destroy
    authorize_employee_update!
    employees_manager.destroy!
    redirect_to_employee_tab("assignments")
  end
end
