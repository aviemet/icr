class TimesheetsController < ApplicationController
  include Searchable

  expose :timesheets, -> { search(Timesheet.includes_associated) }
  expose :timesheet, scope: ->{ Timesheet.includes_associated }

  expose :employees, -> { search(Employee.includes_associated) }
  expose :employee, id: -> { params[:employee_id] }, scope: -> { Employee.includes_associated }

  sortable_fields %w(employee.name approved_at)

  strong_params :timesheet, permit: [:pay_period_id, :employee_id, :approved_at, :approved_by_id]

  # @route GET /payroll (timesheets)
  def index
    paginated_employees = paginate(employees, :employees)
    period_start, period_end = Payroll::Period.period_dates
    pay_period = PayPeriod.for_period_dates(period_start, period_end)
    pay_period.associate_orphan_shifts
    employee_hours = Payroll::EmployeePeriodHours.call(pay_period, paginated_employees.pluck(:id))
    payroll_due = Payroll::Period.payroll_due_date(period_end)
    # approval_window_open = Payroll::Period.approval_window_open?(period_end)
    # timesheet_ids = Timesheet.where(pay_period_id: pay_period.id, employee_id: paginated_employees.pluck(:id)).pluck(:employee_id, :id).to_h.transform_keys(&:to_s)
    # employee_exceptions = timesheet_exception_counts(pay_period, paginated_employees.pluck(:id))

    render inertia: "Timesheets/Index", props: {
      period_dates: -> { Payroll::Period.period_dates.map { |date| date.strftime("%FT%T%:z") } },
      payroll_due_date: -> { payroll_due.strftime("%FT%T%:z") },
      approval_window_open: -> { Payroll::Period.approval_window_open?(period_end) },
      timesheet_ids_by_employee: -> {
        Timesheet.where(
          pay_period_id: pay_period.id,
          employee_id: paginated_employees.pluck(:id),
        )
          .pluck(:employee_id, :id)
          .to_h
          .transform_keys(&:to_s)
      },
      employee_exceptions: -> { timesheet_exception_counts(pay_period, paginated_employees.pluck(:id)) },
      employees: -> { paginated_employees.render(:index) },
      employee_hours: -> { employee_hours },
      pagination: -> { {
        count: employees.count,
        **pagination_data(paginated_employees)
      } },
    }
  end

  # @route GET /payroll/employees/:employee_id (payroll_employee_review)
  def employee_review
    period_start, period_end = Payroll::Period.period_dates
    pay_period = PayPeriod.for_period_dates(period_start, period_end)
    pay_period.associate_orphan_shifts
    timesheet = Timesheet.find_by(employee_id: employee.id, pay_period_id: pay_period.id)
    record_to_authorize = timesheet || Timesheet.new(employee_id: employee.id)
    authorize record_to_authorize, :show?

    shifts_scope = timesheet ? timesheet.shifts.includes(:calendar_event, :category) : Shift.none
    employee_hours = Payroll::EmployeePeriodHours.call(pay_period, [employee.id])
    approval_window_open = Payroll::Period.approval_window_open?(period_end)
    shift_exception_reasons = Payroll::ShiftExceptions.call(shifts_scope)[:reasons_by_shift_id]

    render inertia: "Timesheets/EmployeeReview", props: {
      employee: -> { employee.render(:index) },
      period_dates: -> { Payroll::Period.period_dates.map { |d| d.strftime("%FT%T%:z") } },
      approval_window_open: -> { approval_window_open },
      timesheet: -> { timesheet&.render(:show) },
      shifts: -> { shifts_scope.render(:review) },
      shift_exception_reasons: -> { shift_exception_reasons },
      employee_hours: -> { employee_hours[employee.id.to_s] || {} },
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

  # @route POST /payroll/:id/approve (approve_timesheet)
  def approve
    authorize timesheet, :update?
    _, period_end = Payroll::Period.period_dates

    unless Payroll::Period.approval_window_open?(period_end)
      redirect_to timesheets_url, alert: t("timesheets.approval_window_closed")
      return
    end

    timesheet.update!(approved_at: Time.current, approved_by_id: current_user.id)
    redirect_back_or_to(timesheets_url, notice: t("timesheets.approved"))
  end

  # @route POST /payroll/bulk_approve (bulk_approve_timesheets)
  def bulk_approve
    period_start, period_end = Payroll::Period.period_dates
    unless Payroll::Period.approval_window_open?(period_end)
      redirect_to timesheets_url, alert: t("timesheets.approval_window_closed")
      return
    end

    pay_period = PayPeriod.for_period_dates(period_start, period_end)
    scope = Timesheet.where(pay_period_id: pay_period.id)
    ids = params[:timesheet_ids].presence || (params[:approve_all] ? scope.where(approved_at: nil).pluck(:id) : [])
    approved = 0
    scope.where(id: ids).find_each do |t|
      authorize t, :update?
      next if t.approved_at.present?

      t.update!(approved_at: Time.current, approved_by_id: current_user.id)
      approved += 1
    rescue Pundit::NotAuthorizedError
      next
    end

    redirect_to timesheets_url, notice: t("timesheets.bulk_approved", count: approved)
  end

  private

  def timesheet_exception_counts(pay_period, employee_ids)
    return {} if employee_ids.empty?

    Timesheet
      .where(pay_period_id: pay_period.id, employee_id: employee_ids)
      .includes(shifts: :calendar_event)
      .each_with_object({}) do |timesheet, hash|
        data = Payroll::ShiftExceptions.call(timesheet.shifts)
        hash[timesheet.employee_id.to_s] = { exception_count: data[:exception_count] }
      end
  end
end
