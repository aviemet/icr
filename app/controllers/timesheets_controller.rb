class TimesheetsController < ApplicationController
  include Searchable

  expose :timesheets, -> { search(Timesheet.includes_associated) }
  expose :timesheet, scope: ->{ Timesheet.includes_associated }

  expose :employees, -> { search(Employee.includes_associated) }

  sortable_fields %w(employee.name approved_at)

  strong_params :timesheet, permit: [:pay_period_id, :employee_id, :approved_at, :approved_by_id]

  # @route GET /payroll (timesheets)
  def index
    paginated_employees = paginate(employees, :employees)

    render inertia: "Timesheets/Index", props: {
      period_dates: -> { Payroll::Period.period_dates.map { |date| date.strftime("%FT%T%:z") } },
      employees: -> { paginated_employees.render(:index) },
      pagination: -> { {
        count: employees.count,
        **pagination_data(paginated_employees)
      } },
    }
  end

  # @route GET /payroll/:id (timesheet)
  def show
    authorize timesheet
    render inertia: "Timesheets/Show", props: {
      timesheet: -> { timesheet.render(:show) }
    }
  end

  # @route GET /payroll/new (new_timesheet)
  def new
    authorize Timesheet.new
    render inertia: "Timesheets/New", props: {
      timesheet: Timesheet.new.render(:form_data)
    }
  end

  # @route GET /payroll/:id/edit (edit_timesheet)
  def edit
    authorize timesheet
    render inertia: "Timesheets/Edit", props: {
      timesheet: timesheet.render(:edit)
    }
  end

  # @route POST /payroll (timesheets)
  def create
    authorize Timesheet.new
    timesheet.assign_attributes(timesheet_params)
    if timesheet.save
      redirect_to timesheet, notice: t("templates.controllers.notices.created", model: "Timesheet")
    else
      redirect_to new_timesheet_path, inertia: { errors: timesheet.errors }
    end
  end

  # @route PATCH /payroll/:id (timesheet)
  # @route PUT /payroll/:id (timesheet)
  def update
    authorize timesheet
    if timesheet.update(timesheet_params)
      redirect_to timesheet, notice: t("templates.controllers.notices.updated", model: "Timesheet")
    else
      redirect_to edit_timesheet_path(timesheet), inertia: { errors: timesheet.errors }
    end
  end

  # @route DELETE /payroll/:id (timesheet)
  def destroy
    authorize timesheet
    timesheet.destroy!
    redirect_to timesheets_url, notice: t("templates.controllers.notices.destroyed", model: "Timesheet")
  end
end
