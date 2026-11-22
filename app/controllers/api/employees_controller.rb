class Api::EmployeesController < Api::ApiController
  expose :employees, -> { policy_scope(Employee.includes_associated) }
  expose :employee, id: -> { params[:slug] }, scope: -> { policy_scope(Employee.includes_associated) }, find_by: :slug

  # @route GET /api/options/employees (api_employees_options)
  def options
    render json: employees.includes([person: [:user, :client]]).render(:options)
  end

  # @route GET /api/employees/:slug/schedule {param: :slug} (api_employee_schedule)
  def schedule
    authorize employee, :schedule?

    range_start, range_end = DateRangeCalculator.new(params).call
    masters = employee.schedule_events_between(range_start, range_end)

    render json: Calendar::RenderSchedule.call(
      events: masters,
      range_start: range_start,
      range_end: range_end,
      view: :employee,
    )
  end
end
