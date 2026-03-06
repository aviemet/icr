class Api::EmployeesController < Api::ApiController
  expose :employees, -> { Employee.includes_associated.all }

  # @route GET /api/options/employees (api_employees_options)
  def options
    render json: employees.includes([person: [:user, :client]]).render(:options)
  end

  # @route GET /api/employees/:slug/schedule {param: :slug} (api_employee_schedule)
  def schedule
    schedules = Employee
      .find_by!(slug: params[:slug])
      .schedule_events_between(*DateRangeCalculator.new(params).call)

    render json: schedules.render(:employee)
  end
end
