class EmployeesController < ApplicationController
  include Searchable

  expose :employees, -> { search(Employee.includes_associated) }
  expose :employee, id: -> { params[:slug] }, find_by: :slug

  sortable_fields %w(person_id active_at inactive_at number)

  strong_params :employee, permit: [:person_id, :active_at, :inactive_at, :number]

  # @route GET /employees (employees)
  def index
    authorize employees

    render inertia: "Employees/Index", props: {
      employees: -> { employees.render(:index) }
    }
  end

  # @route GET /employees/:slug (employee)
  def show
    authorize employee

    render inertia: "Employees/Show", props: {
      employee: -> { employee.render(:show) }
    }
  end

  # @route GET /employees/new (new_employee)
  def new
    authorize Employee.new

    render inertia: "Employees/New", props: {
      employee: Employee.new.render(:form_data)
    }
  end

  # @route GET /employees/:slug/edit (edit_employee)
  def edit
    authorize employee

    render inertia: "Employees/Edit", props: {
      employee: employee.render(:edit)
    }
  end

  # @route GET /employees/:slug/schedule (schedule_employee)
  def schedule
    schedules = Employee
      .includes([:person])
      .find_by(slug: params[:slug])
      .calendar_events
      .includes([:recurring_patterns, shift: [employee: [:person, :job_title, :calendar_customization]]])
      .between(range_start, range_end)

    render inertia: "Employees/Schedule", props: {
      employee: -> { employee.render(:show) },
      schedules: lambda {
        schedules.render(:show)
      },
    }
  end

  # @route POST /employees (employees)
  def create
    authorize Employee.new
    if employee.save
      redirect_to employee, notice: t("employees.notices.created")
    else
      redirect_to new_employee_path, inertia: { errors: employee.errors }
    end
  end

  # @route PATCH /employees/:slug (employee)
  # @route PUT /employees/:slug (employee)
  def update
    authorize employee
    if employee.update(employee_params)
      redirect_to employee, notice: t("employees.notices.created")
    else
      redirect_to edit_employee_path, inertia: { errors: employee.errors }
    end
  end

  # @route DELETE /employees/:slug (employee)
  def destroy
    authorize employee
    employee.destroy!
    redirect_to employees_url, notice: t("employees.notices.created")
  end

  private

  def range_start
    params[:start] || Time.current.beginning_of_month.prev_occurring(:sunday)
  end

  def range_end
    params[:end] || Time.current.end_of_month.next_occurring(:saturday)
  end
end
