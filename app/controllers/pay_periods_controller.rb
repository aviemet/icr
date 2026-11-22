class PayPeriodsController < ApplicationController
  include Searchable

  expose :pay_period
  expose :employees, -> {
    search(
      Employee.includes_associated
        .where(id: pay_period.timesheets.joins(:shifts).select(:employee_id))
        .order("employees.id"),
    )
  }

  # @route GET /payroll (payroll_periods)
  def index
    authorize PayPeriod
    period_start, period_end = Payroll::Period.period_dates
    current_period = PayPeriod.for_period_dates(period_start, period_end)
    current_period.sync_shifts! unless current_period.finalized?
    employee_ids = period_employee_ids(current_period)
    current_summary = Payroll::PeriodSummary.call(current_period, employee_ids: employee_ids)
    eligibility = Payroll::FinalizeEligibility.call(current_period, summary: current_summary)
    recent_periods = PayPeriod.recent_first.limit(10)

    render inertia: "PayPeriods/Index", props: {
      current_period: -> { current_period.render },
      current_summary: -> { current_summary.except(:exception_counts) },
      can_finalize: -> { eligibility[:can_finalize] },
      finalize_blocked_reason: -> { eligibility[:finalize_blocked_reason] },
      can_export: -> { eligibility[:can_export] },
      periods: -> {
        recent_periods.map { |period|
          Payroll::PeriodSummary.archive_row(period, employee_ids: period_employee_ids(period))
        }
      },
    }
  end

  # @route GET /payroll/periods/:id (period)
  def show
    authorize pay_period
    unless employee_combined_access?
      redirect_to clients_period_path(pay_period)
      return
    end

    pay_period.sync_shifts! unless pay_period.finalized?

    summary_service = Payroll::PeriodSummary.new(pay_period, employee_ids: employees.pluck(:id))
    summary = summary_service.call
    eligibility = Payroll::FinalizeEligibility.call(pay_period, summary: summary)
    paginated_employees = paginate(employees, :employees)
    queue = Payroll::EmployeeQueue.call(
      period: pay_period,
      employees: paginated_employees,
      total_count: employees.count,
      pagination: pagination_data(paginated_employees),
      exception_counts: summary[:exception_counts],
    )

    render inertia: "PayPeriods/Show", props: {
      pay_period: -> { pay_period.render },
      period_dates: -> { [pay_period.starts_at, pay_period.ends_at].map { |date| date.strftime("%FT%T%:z") } },
      payroll_due_date: -> { summary[:payroll_due_date] },
      approval_window_open: -> { summary[:approval_window_open] },
      workflow_status: -> { summary[:workflow_status] },
      finalized: -> { pay_period.finalized? },
      can_approve: -> { eligibility[:can_approve] && employee_combined_access? },
      can_finalize: -> { eligibility[:can_finalize] },
      finalize_blocked_reason: -> { eligibility[:finalize_blocked_reason] },
      can_export: -> { eligibility[:can_export] },
      can_view_clients: -> { true },
      summary: -> { summary_service.show_counts },
      adjustments: -> { pay_period.adjustments.order(created_at: :desc).limit(50).map(&:render) },
      **queue.transform_values { |value| -> { value } },
    }
  end

  # @route GET /payroll/periods/:id/clients (period_clients)
  def clients
    authorize pay_period, :show?
    pay_period.sync_shifts! unless pay_period.finalized?

    client_scope = Payroll::ClientScopeForUser.call(user: current_user, period: pay_period)
    client_ids = client_scope.pluck(:id)
    summary_service = Payroll::PeriodSummary.new(pay_period, employee_ids: period_employee_ids(pay_period))
    summary = summary_service.call
    queue = Payroll::ClientPeriodQueue.call(period: pay_period, client_ids: client_ids)

    render inertia: "PayPeriods/Clients", props: {
      pay_period: -> { pay_period.render },
      period_dates: -> { [pay_period.starts_at, pay_period.ends_at].map { |date| date.strftime("%FT%T%:z") } },
      payroll_due_date: -> { summary[:payroll_due_date] },
      finalized: -> { pay_period.finalized? },
      can_facilitator_approve: -> { !pay_period.finalized? && facilitator_approve_access? },
      can_view_employees: -> { employee_combined_access? },
      summary: -> { summary_service.show_counts },
      period_clients: -> { queue[:period_clients] },
      pending_shift_count_by_client: -> { queue[:pending_shift_count_by_client] },
      reviewed_shift_count_by_client: -> { queue[:reviewed_shift_count_by_client] },
      total_shift_count_by_client: -> { queue[:total_shift_count_by_client] },
    }
  end

  # @route GET /payroll/periods/:id/clients/:client_id (period_client)
  def client
    authorize pay_period, :show?
    pay_period.sync_shifts! unless pay_period.finalized?

    scoped_clients = Payroll::ClientScopeForUser.call(user: current_user, period: pay_period)
    client_record = scoped_clients.find(params.expect(:client_id))
    shifts_list = Payroll::ClientPeriodQueue.shifts_for_client(period: pay_period, client_id: client_record.id)
    last_editors = Payroll::ShiftLastEditors.call(shifts_list)
    shifts_list.each do |shift|
      shift.instance_variable_set(:@_last_editor, last_editors[shift.calendar_event_id.to_s])
    end
    shift_exception_reasons = Payroll::ShiftExceptions.call(shifts_list)[:reasons_by_shift_id]
    employee_ids = shifts_list.map(&:employee_id).compact.uniq
    employees_list = Employee.where(id: employee_ids).includes(:person).to_a
    hours_by_employee = Payroll::EmployeePeriodHours.call(pay_period, employee_ids)
    shift_ot_hours = hours_by_employee.each_with_object({}) do |(_employee_id, hours_data), hash|
      hash.merge!(hours_data[:shift_ot_hours] || {})
    end

    render inertia: "PayPeriods/Client", props: {
      pay_period: -> { pay_period.render },
      period_dates: -> { [pay_period.starts_at, pay_period.ends_at].map { |date| date.strftime("%FT%T%:z") } },
      finalized: -> { pay_period.finalized? },
      can_facilitator_approve: -> { !pay_period.finalized? && facilitator_approve_access? },
      can_view_employees: -> { employee_combined_access? },
      period_client: -> { client_record.render(:persisted) },
      period_employees: -> {
        employees_list
          .map { |employee|
            {
              id: employee.id.to_s,
              name: employee.full_name.presence || employee.name || "-",
              slug: employee.slug,
            }
          }
          .sort_by { |row| row[:name].to_s.downcase }
      },
      shifts: -> { shifts_list.map { |row| row.render(:review) } },
      shift_exception_reasons: -> { shift_exception_reasons },
      shift_ot_hours: -> { shift_ot_hours.transform_keys(&:to_s) },
    }
  end

  # @route POST /payroll/periods/:id/finalize (finalize_period)
  def finalize
    authorize pay_period, :finalize?
    period_end = pay_period.ends_at.to_date

    if pay_period.finalized?
      redirect_to period_path(pay_period), alert: t("pay_periods.already_finalized")
      return
    end

    if Date.current <= period_end
      redirect_to period_path(pay_period), alert: t("pay_periods.finalize_before_period_end")
      return
    end

    pay_period.finalize!(current_user)
    redirect_to period_path(pay_period), notice: t("pay_periods.finalized")
  end

  # @route GET /payroll/periods/:id/export (export_period)
  def export
    authorize pay_period, :export?

    unless pay_period.finalized?
      redirect_to period_path(pay_period), alert: t("pay_periods.export_requires_finalized")
      return
    end

    csv = Payroll::HoursExport.call(pay_period)
    pay_period.record_export!(current_user)

    filename = "payroll-hours-#{pay_period.starts_at.to_date.iso8601}-#{pay_period.ends_at.to_date.iso8601}.csv"
    send_data csv, filename: filename, type: "text/csv; charset=utf-8", disposition: "attachment"
  end

  # @route POST /payroll/periods/:id/adjustments (adjustments_period)
  def create_adjustment
    authorize pay_period, :create_adjustment?

    unless pay_period.finalized?
      redirect_to period_path(pay_period), alert: t("pay_periods.adjustments_require_finalized")
      return
    end

    timesheet = pay_period.timesheets.find_by(id: params[:timesheet_id])
    employee = timesheet&.employee || Employee.find_by(id: params[:employee_id])
    reason = params.require(:reason)
    change_set = params.permit(change_set: {}).fetch(:change_set, {}).to_h

    if change_set.blank?
      redirect_to period_path(pay_period), alert: t("pay_periods.adjustment_change_set_required")
      return
    end

    pay_period.record_adjustment!(
      user: current_user,
      reason: reason,
      change_set: change_set,
      timesheet: timesheet,
      employee: employee,
    ) do
      Payroll::ApplyAdjustment.call(timesheet, change_set) if timesheet
    end

    redirect_to period_path(pay_period), notice: t("pay_periods.adjustment_recorded")
  rescue ActiveRecord::RecordInvalid => e
    redirect_to period_path(pay_period), alert: e.record.errors.full_messages.to_sentence.presence || t("pay_periods.adjustment_failed")
  end

  private

  def period_employee_ids(period)
    period.timesheets.joins(:shifts).distinct.pluck(:employee_id)
  end

  def employee_combined_access?
    return true if current_user.has_role?(:admin)

    policy(pay_period).update?
  end

  def facilitator_approve_access?
    return true if current_user.has_role?(:admin)

    employee = current_user.person&.employee
    return false if employee.blank?

    job_title = employee.job_title
    return false if job_title.blank?
    return false unless job_title.has_role?(:update, Timesheet)
    return false if job_title.has_role?(:index, Timesheet)

    true
  end
end
