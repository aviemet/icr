# frozen_string_literal: true

class Dashboard::Stats
  ActivityItem = Struct.new(:kind, :id, :name, :created_at, keyword_init: true) do
    def to_h
      { kind: kind, id: id, name: name, created_at: created_at }
    end
  end

  PendingTermination = Struct.new(:id, :slug, :name, :inactive_at, keyword_init: true) do
    def to_h
      { id: id, slug: slug, name: name, inactive_at: inactive_at }
    end
  end

  OpenShiftItem = Struct.new(:id, :client_name, :client_slug, :starts_at, :ends_at, keyword_init: true) do
    def to_h
      {
        id: id,
        client_name: client_name,
        client_slug: client_slug,
        starts_at: starts_at,
        ends_at: ends_at,
      }
    end
  end

  MyUpcomingShift = Struct.new(:id, :client_name, :client_slug, :starts_at, :ends_at, keyword_init: true) do
    def to_h
      {
        id: id,
        client_name: client_name,
        client_slug: client_slug,
        starts_at: starts_at,
        ends_at: ends_at,
      }
    end
  end

  Payload = Struct.new(
    :active_client_count,
    :inactive_client_count,
    :active_team_count,
    :hiring_pipeline_count,
    :week_tracked_hours,
    :pending_timesheet_count,
    :open_shift_count,
    :staffing_visible,
    :open_shifts,
    :my_upcoming_shifts,
    :activity_items,
    :pending_terminations,
    keyword_init: true,
  ) do
    def to_h
      {
        active_client_count: active_client_count,
        inactive_client_count: inactive_client_count,
        active_team_count: active_team_count,
        hiring_pipeline_count: hiring_pipeline_count,
        week_tracked_hours: week_tracked_hours,
        pending_timesheet_count: pending_timesheet_count,
        open_shift_count: open_shift_count,
        staffing_visible: staffing_visible,
        open_shifts: open_shifts.map(&:to_h),
        my_upcoming_shifts: my_upcoming_shifts.map(&:to_h),
        activity_items: activity_items.map(&:to_h),
        pending_terminations: pending_terminations.map(&:to_h),
      }
    end
  end

  def initialize(user)
    @user = user
  end

  def payload
    Payload.new(
      active_client_count: active_client_count,
      inactive_client_count: inactive_client_count,
      active_team_count: active_team_count,
      hiring_pipeline_count: hiring_pipeline_count,
      week_tracked_hours: week_tracked_hours_total,
      pending_timesheet_count: pending_timesheet_count,
      open_shift_count: open_shift_count,
      staffing_visible: staffing_visible?,
      open_shifts: open_shifts_payload,
      my_upcoming_shifts: my_upcoming_shifts_payload,
      activity_items: activity_items_payload,
      pending_terminations: pending_terminations_payload,
    )
  end

  private

  attr_reader :user

  def clients_scope
    user ? Pundit.policy_scope(user, Client) : Client.none
  end

  def employees_scope
    user ? Pundit.policy_scope(user, Employee) : Employee.none
  end

  def timesheets_scope
    user ? Pundit.policy_scope(user, Timesheet) : Timesheet.none
  end

  def today
    Time.zone.today
  end

  def active_client_count
    clients_scope.where(
      "clients.active_at IS NOT NULL AND (clients.inactive_at IS NULL OR clients.inactive_at > ?)",
      today,
    ).count
  end

  def inactive_client_count
    clients_scope.where(
      "NOT (clients.active_at IS NOT NULL AND (clients.inactive_at IS NULL OR clients.inactive_at > ?))",
      today,
    ).count
  end

  def active_team_count
    employees_scope.actively_employed.where(
      "employees.active_at IS NOT NULL AND (employees.inactive_at IS NULL OR employees.inactive_at > ?)",
      today,
    ).count
  end

  def hiring_pipeline_count
    employees_scope.where(status: [:applicant, :offered]).count
  end

  def staffing_visible?
    Shifts::OpenVisibility.can_view?(user)
  end

  def open_shift_count
    Shifts::OpenVisibility.new(user).future_open_count
  end

  def open_shifts_payload
    Shifts::OpenVisibility.future_open_shifts_for(user)
      .limit(5)
      .map { |shift| serialize_open_shift(shift) }
  end

  def serialize_open_shift(shift)
    client = shift.calendar_event&.clients&.first
    OpenShiftItem.new(
      id: shift.id,
      client_name: client&.person&.name.to_s.presence || I18n.t("views.dashboard.staffing.open_shift"),
      client_slug: client&.slug.to_s,
      starts_at: shift.starts_at.iso8601,
      ends_at: shift.ends_at.iso8601,
    )
  end

  def my_upcoming_shifts_payload
    employee = user&.person&.employee
    return [] if employee.blank?

    range_start = Time.zone.now
    range_end = 14.days.from_now
    shifts = Shift.assigned
      .where(employee_id: employee.id)
      .joins(:calendar_event)
      .merge(Calendar::Event.for_schedule_range(range_start, range_end))
      .includes(calendar_event: [:recurring_patterns, :event_exceptions, { clients: :person }])

    rows = shifts.flat_map do |shift|
      shift.calendar_event.occurrences_in(range_start, range_end).map do |occurrence|
        [shift, occurrence]
      end
    end

    rows
      .sort_by { |_shift, occurrence| occurrence.starts_at }
      .first(5)
      .map { |shift, occurrence| serialize_my_upcoming_shift(shift, occurrence) }
  end

  def serialize_my_upcoming_shift(shift, occurrence)
    client = shift.calendar_event&.clients&.first
    MyUpcomingShift.new(
      id: Payroll::ShiftOccurrence.interval_id(shift.id, occurrence),
      client_name: client&.person&.name.to_s.presence || I18n.t("views.dashboard.my_schedule.untitled"),
      client_slug: client&.slug.to_s,
      starts_at: occurrence.starts_at.iso8601,
      ends_at: occurrence.ends_at.iso8601,
    )
  end

  def activity_items_payload
    client_rows = clients_scope.includes(:person).order(created_at: :desc).limit(5).map do |client|
      ActivityItem.new(
        kind: "client",
        id: client.id,
        name: client.person&.name.to_s,
        created_at: client.created_at.iso8601,
      )
    end
    employee_rows = employees_scope.includes(:person).order(created_at: :desc).limit(5).map do |employee|
      ActivityItem.new(
        kind: "employee",
        id: employee.id,
        name: employee.person&.name.to_s,
        created_at: employee.created_at.iso8601,
      )
    end
    (client_rows + employee_rows)
      .sort_by { |row| Time.zone.parse(row.created_at) }
      .reverse
      .first(5)
  end

  def week_tracked_hours_total
    range_start = Time.zone.now.beginning_of_week
    range_end = Time.zone.now.end_of_week
    employee_ids = employees_scope.pluck(:id)
    return 0.0 if employee_ids.empty?

    events = Calendar::Event.for_schedule_range(range_start, range_end)
      .joins(:shift)
      .merge(Shift.assigned.where(employee_id: employee_ids))
      .includes(:recurring_patterns, :event_exceptions)

    Calendar::Event.occurrences_in(events, range_start: range_start, range_end: range_end).sum do |occurrence|
      (occurrence.ends_at - occurrence.starts_at) / 1.hour
    end.to_f
  end

  def pending_timesheet_count
    period_start_date, period_end_date = Payroll::Period.period_dates
    pay_period = PayPeriod.find_by(
      starts_at: period_start_date.to_time.beginning_of_day,
      ends_at: period_end_date.to_time.end_of_day,
    )
    return 0 unless pay_period

    timesheets_scope
      .where(pay_period_id: pay_period.id, approved_at: nil)
      .count
  end

  def can_view_pending_terminations?
    return false if user.blank?
    return true if user.has_role?(:admin)

    job_title = user.person&.employee&.job_title
    job_title&.has_role?(:update, Employee) || false
  end

  def pending_terminations_payload
    return [] unless can_view_pending_terminations?

    employees_scope
      .pending_termination
      .includes(:person)
      .order(:inactive_at)
      .map do |employee|
        PendingTermination.new(
          id: employee.id,
          slug: employee.slug,
          name: employee.person&.name.to_s,
          inactive_at: employee.inactive_at.iso8601,
        )
      end
  end
end
