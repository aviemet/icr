class TimesheetsController < ApplicationController
  include Searchable

  expose :timesheets, -> { search(Timesheet.includes_associated) }
  expose :timesheet, scope: -> { Timesheet.includes_associated }
  expose :employee, id: -> { params[:employee_slug] }, find_by: :slug, scope: -> { Employee.includes_associated }
  expose :pay_period, id: -> { params[:period_slug] }, find_by: :slug, model: PayPeriod

  sortable_fields %w(employee.name approved_at)

  strong_params :timesheet, permit: [:pay_period_id, :employee_id, :approved_at]

  # @route GET /payroll/periods/:period_slug/employees/:employee_slug (period_employee_review)
  def employee_review
    authorize_pay_period!
    pay_period.sync_shifts! unless pay_period.finalized? || inertia_partial_data_request?
    @review_timesheet = Timesheet.find_by(employee_id: employee.id, pay_period_id: pay_period.id)
    record_to_authorize = @review_timesheet || Timesheet.new(employee_id: employee.id)
    authorize record_to_authorize, :show?

    render inertia: "Timesheets/EmployeeReview", props: {
      employee: -> { employee.render(:index) },
      pay_period_id: -> { pay_period.id.to_s },
      pay_period_slug: -> { pay_period.slug },
      period_dates: -> { [pay_period.starts_at, pay_period.ends_at].map { |date| date.strftime("%FT%T%:z") } },
      approval_window_open: -> {
        !pay_period.finalized? && Payroll::Period.approval_window_open?(pay_period.ends_at.to_date)
      },
      finalized: -> { pay_period.finalized? },
      can_approve: -> {
        @review_timesheet.present? && !pay_period.finalized? && policy(@review_timesheet).final_approve?
      },
      timesheet: -> { @review_timesheet&.render(:show) },
      shifts: -> { employee_review_shifts.map { |shift| shift.render(:review) } },
      shift_exception_reasons: -> {
        Payroll::ShiftExceptions.call(employee_review_shifts)[:reasons_by_shift_id]
      },
      shift_ot_hours: -> { employee_review_hours_data[:shift_ot_hours] || {} },
      employee_hours: -> { employee_review_hours_data.except(:shift_ot_hours) },
      unreviewed_shifts: -> {
        @review_timesheet.present? ? Payroll::UnreviewedShifts.call(@review_timesheet) : []
      },
      ihss_assignment_mode: -> { Setting.ihss_assignment_mode },
      can_edit_ihss: -> {
        !pay_period.finalized? && @review_timesheet.present? && policy(@review_timesheet).update?
      },
    }
  end

  # @route GET /payroll/timesheets/:id (timesheet)
  def show
    authorize timesheet
    render inertia: "Timesheets/Show", props: {
      timesheet: -> { timesheet.render(:show) }
    }
  end

  # @route GET /payroll/timesheets/new (new_timesheet)
  def new
    authorize Timesheet.new
    render inertia: "Timesheets/New", props: {
      timesheet: Timesheet.new.render(:form_data)
    }
  end

  # @route GET /payroll/timesheets/:id/edit (edit_timesheet)
  def edit
    authorize timesheet
    render inertia: "Timesheets/Edit", props: {
      timesheet: timesheet.render(:edit)
    }
  end

  # @route POST /payroll/timesheets (timesheets)
  def create
    authorize Timesheet.new
    timesheet.assign_attributes(timesheet_params)

    if timesheet.save
      redirect_to timesheet, notice: t("templates.controllers.notices.created", model: "Timesheet")
    else
      redirect_to new_timesheet_path, inertia: { errors: timesheet.errors }
    end
  end

  # @route PATCH /payroll/timesheets/:id (timesheet)
  # @route PUT /payroll/timesheets/:id (timesheet)
  def update
    authorize timesheet
    if timesheet.pay_period&.finalized?
      redirect_to timesheet, alert: t("pay_periods.finalized_locked")
      return
    end

    if timesheet.update(timesheet_params)
      redirect_to timesheet, notice: t("templates.controllers.notices.updated", model: "Timesheet")
    else
      redirect_to edit_timesheet_path(timesheet), inertia: { errors: timesheet.errors }
    end
  end

  # @route DELETE /payroll/timesheets/:id (timesheet)
  def destroy
    authorize timesheet
    if timesheet.pay_period&.finalized?
      redirect_to timesheets_url, alert: t("pay_periods.finalized_locked")
      return
    end

    timesheet.destroy!
    redirect_to payroll_periods_url, notice: t("templates.controllers.notices.destroyed", model: "Timesheet")
  end

  # @route POST /payroll/timesheets/:id/approve (approve_timesheet)
  def approve
    authorize timesheet, :final_approve?
    period = timesheet.pay_period

    if period.finalized?
      redirect_to period_path(period), alert: t("pay_periods.finalized_locked")
      return
    end

    timesheet.update!(approved_at: Time.current)
    redirect_back_or_to(period_path(period), notice: t("timesheets.approved"))
  end

  # @route POST /payroll/timesheets/:id/unapprove (unapprove_timesheet)
  def unapprove
    authorize timesheet, :final_unapprove?
    period = timesheet.pay_period

    if period.finalized?
      redirect_to period_path(period), alert: t("pay_periods.finalized_locked")
      return
    end

    timesheet.update!(approved_at: nil)
    redirect_back_or_to(period_path(period), notice: t("timesheets.unapproved"))
  end

  # @route POST /payroll/timesheets/bulk_approve (bulk_approve_timesheets)
  def bulk_approve
    period = PayPeriod.find(params.require(:pay_period_id))
    authorize period, :show?

    if period.finalized?
      redirect_to period_path(period), alert: t("pay_periods.finalized_locked")
      return
    end

    scope = Timesheet.where(pay_period_id: period.id)
    ids = params[:timesheet_ids].presence || (params[:approve_all] ? scope.where(approved_at: nil).pluck(:id) : [])
    approved = 0
    scope.where(id: ids).find_each do |row|
      authorize row, :final_approve?
      next if row.approved_at.present?

      row.update!(approved_at: Time.current)
      approved += 1
    rescue Pundit::NotAuthorizedError
      next
    end

    redirect_to period_path(period), notice: t("timesheets.bulk_approved", count: approved)
  end

  private

  def authorize_pay_period!
    authorize pay_period, :show?
  end

  def employee_review_shifts
    @employee_review_shifts ||= begin
      base_shifts = PayPeriod.shifts_overlapping_period(pay_period)
        .assigned
        .where(employee_id: employee.id)
        .includes(
          :category,
          calendar_event: [
            :recurring_patterns,
            :event_exceptions,
            { clients: :person },
          ],
        )
        .to_a
      shifts_list = pay_period.shift_occurrences(base_shifts)
      last_editors = Payroll::ShiftLastEditors.call(base_shifts)
      shifts_list.each do |shift|
        shift.instance_variable_set(:@_last_editor, last_editors[shift.calendar_event_id.to_s])
      end
      shifts_list
    end
  end

  def employee_review_hours_data
    @employee_review_hours_data ||=
      Payroll::EmployeePeriodHours.call(pay_period, [employee.id])[employee.id.to_s] || {}
  end
end
