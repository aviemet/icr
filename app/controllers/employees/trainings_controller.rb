class Employees::TrainingsController < Employees::BaseController
  expose :employees_training, model: Employee::EmployeesTraining, scope: -> { employee.employees_trainings }

  strong_params :employees_training, permit: [:training_id, :started_at, :completed_at]

  # @route POST /employees/:employee_slug/trainings (employee_trainings)
  def create
    authorize_employee_update!
    if completing_in_params?
      authorize Employee::Training, :complete?, policy_class: Employee::TrainingPolicy
    end
    employees_training.assign_attributes(employees_training_params)
    employees_training.save
    redirect_to_employee_tab("trainings")
  end

  # @route PATCH /employees/:employee_slug/trainings/:id (employee_training)
  # @route PUT /employees/:employee_slug/trainings/:id (employee_training)
  def update
    authorize_employee_update!
    if completing_in_params?
      authorize Employee::Training, :complete?, policy_class: Employee::TrainingPolicy
    end
    employees_training.update(employees_training_params)
    redirect_to_employee_tab("trainings")
  end

  # @route DELETE /employees/:employee_slug/trainings/:id (employee_training)
  def destroy
    authorize_employee_update!
    employees_training.destroy!
    redirect_to_employee_tab("trainings")
  end

  private

  def completing_in_params?
    employees_training_params[:completed_at].present?
  end
end
