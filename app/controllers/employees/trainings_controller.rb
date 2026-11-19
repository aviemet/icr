class Employees::TrainingsController < Employees::BaseController
  expose :employees_training, model: Employee::EmployeesTraining, scope: -> { employee.employees_trainings }

  strong_params :employees_training, permit: [:training_id, :started_at, :completed_at]

  def create
    authorize_employee_update!
    employees_training.assign_attributes(employees_training_params)
    employees_training.save
    redirect_to_employee_tab("trainings")
  end

  def update
    authorize_employee_update!
    employees_training.update(employees_training_params)
    redirect_to_employee_tab("trainings")
  end

  def destroy
    authorize_employee_update!
    employees_training.destroy!
    redirect_to_employee_tab("trainings")
  end
end
