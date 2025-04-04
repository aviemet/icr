class Api::EmployeesController < Api::ApiController
  expose :employees, -> { Employee.includes_associated.all }

  # @route GET /api/options/employees (api_employees_options)
  def options
    render json: employees.render(:options)
  end

  def schedule
    schedules = Employee
      .includes([:person])
      .find_by(slug: params[:slug])
      .calendar_events
      .includes([:recurring_patterns, shift: [employee: [:person, :job_title, :calendar_customization]]])
      .between(*DateRangeCalculator.new(params).call)

    render json: schedules.render
  end
end
