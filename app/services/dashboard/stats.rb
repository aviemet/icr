# frozen_string_literal: true

class Dashboard::Stats
  UpcomingEvent = Struct.new(:id, :name, :starts_at, :ends_at, keyword_init: true) do
    def to_h
      { id: id, name: name, starts_at: starts_at, ends_at: ends_at }
    end
  end

  ActivityItem = Struct.new(:kind, :id, :name, :created_at, keyword_init: true) do
    def to_h
      { kind: kind, id: id, name: name, created_at: created_at }
    end
  end

  Payload = Struct.new(
    :active_client_count,
    :inactive_client_count,
    :active_team_count,
    :hiring_pipeline_count,
    :week_tracked_hours,
    :pending_timesheet_count,
    :upcoming_events,
    :activity_items,
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
        upcoming_events: upcoming_events.map(&:to_h),
        activity_items: activity_items.map(&:to_h),
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
      upcoming_events: upcoming_events_payload,
      activity_items: activity_items_payload,
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

  def events_scope
    user ? Pundit.policy_scope(user, Calendar::Event) : Calendar::Event.none
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

  def upcoming_events_payload
    events_scope
      .includes_associated
      .after(Time.zone.now)
      .order(:starts_at)
      .limit(5)
      .map { |event| serialize_event(event) }
  end

  def serialize_event(event)
    UpcomingEvent.new(
      id: event.id,
      name: event_label(event),
      starts_at: event.starts_at.iso8601,
      ends_at: event.ends_at.iso8601,
    )
  end

  def event_label(event)
    name = event.name.presence
    return name if name

    person = event.shift&.employee&.person
    return I18n.t("views.dashboard.schedule.untitled_shift") if person.blank?

    I18n.t("views.dashboard.schedule.shift_for", name: person.name)
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

    total = Shift.where(employee_id: employee_ids)
      .joins(:calendar_event)
      .merge(Calendar::Event.between(range_start, range_end))
      .sum(Arel.sql("(EXTRACT(EPOCH FROM (calendar_events.ends_at - calendar_events.starts_at)) / 3600.0)"))
    total.to_f
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
end
