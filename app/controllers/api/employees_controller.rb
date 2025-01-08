class Api::EmployeesController < Api::ApiController
  expose :employees, -> { Employee.includes_associated.all }

  # @route GET /api/options/employees (api_employees_options)
  def options
    render json: employees.render(:options)
  end
end
