# frozen_string_literal: true

class Dev::SeedShifts
  class EnvironmentError < StandardError; end

  Result = Struct.new(:shifts_created, :timesheets_updated, keyword_init: true)

  LENGTHS = [4, 5, 6].freeze
  SLOTS = [
    { start_hour: 7, end_hour: 13 },
    { start_hour: 13, end_hour: 19 },
  ].freeze

  def self.call(...)
    new(...).perform
  end

  def initialize(random: Random.new, start_date: nil, end_date: nil)
    @random = random
    @start_date = start_date || Date.current.prev_month.beginning_of_month
    @end_date = end_date || Date.current.end_of_month
  end

  def perform
    raise EnvironmentError, "dev:seed:shifts only runs in development" unless Rails.env.development?

    clients = Client.order(:created_at).to_a
    employees = Employee.order(:created_at).to_a
    raise ArgumentError, "dev:seed:shifts needs at least one client and one employee" if clients.empty? || employees.empty?
    raise ArgumentError, "start_date must be on or before end_date" if @start_date > @end_date

    load_existing_coverage
    created_shift_ids = []

    timesheets_updated = 0
    ActiveRecord::Base.transaction do
      (@start_date..@end_date).each do |date|
        created_shift_ids.concat(seed_day(date, clients, employees))
      end
      link_pay_periods
      timesheets_updated = write_hour_columns(created_shift_ids)
    end

    Result.new(shifts_created: created_shift_ids.size, timesheets_updated:)
  end

  private

  def load_existing_coverage
    @occupied = Hash.new { |intervals, employee_id| intervals[employee_id] = [] }
    @covered = {}

    Shift.joins(:calendar_event).pluck(
      "shifts.employee_id",
      "calendar_events.starts_at",
      "calendar_events.ends_at",
    ).each do |employee_id, starts_at, ends_at|
      next if starts_at.blank? || ends_at.blank?

      @occupied[employee_id] << [starts_at, ends_at]
    end

    EventParticipant.where(participant_type: "Client").joins(:calendar_event).pluck(
      "event_participants.participant_id",
      "calendar_events.starts_at",
      "calendar_events.ends_at",
    ).each do |client_id, starts_at, ends_at|
      next if starts_at.blank? || ends_at.blank?

      cover_dates(client_id, starts_at, ends_at)
    end
  end

  def seed_day(date, clients, employees)
    return [] if date.sunday?
    return [] if date.saturday? && @random.rand < 0.5

    pairs = employee_slots(employees).shuffle(random: @random)
    created_ids = []

    clients.shuffle(random: @random).each do |client|
      next if covered?(client, date)

      assignment = take_open_assignment(date, pairs)
      next unless assignment

      created_ids << create_shift(
        client: client,
        employee: assignment[:employee],
        starts_at: assignment[:starts_at],
        ends_at: assignment[:ends_at],
      ).id
    end

    created_ids
  end

  def employee_slots(employees)
    SLOTS.flat_map do |slot|
      employees.map { |employee| { employee:, slot: } }
    end
  end

  def take_open_assignment(date, pairs)
    pairs.each_with_index do |pair, index|
      starts_at, ends_at = bounds_for(date, pair[:slot])
      next if overlaps?(pair[:employee].id, starts_at, ends_at)

      pairs.delete_at(index)
      return { employee: pair[:employee], starts_at:, ends_at: }
    end

    nil
  end

  def bounds_for(date, slot)
    length = LENGTHS[@random.rand(LENGTHS.length)]
    latest_start = slot[:end_hour] - length
    start_hour = @random.rand(slot[:start_hour]..latest_start)
    starts_at = Time.zone.local(date.year, date.month, date.day, start_hour)
    [starts_at, starts_at + length.hours]
  end

  def create_shift(client:, employee:, starts_at:, ends_at:)
    calendar_event = FactoryBot.create(
      :calendar_event,
      starts_at: starts_at,
      ends_at: ends_at,
      category_id: event_category_id,
    )
    shift = FactoryBot.build(:shift, employee:, calendar_event:)
    shift.category = regular_shift_category
    shift.save!
    calendar_event.reload.update!(name: nil)
    client.calendar_events << calendar_event
    @occupied[employee.id] << [starts_at, ends_at]
    cover_dates(client.id, starts_at, ends_at)
    shift
  end

  def event_category_id
    @event_category_id ||= Category.type("Calendar::Event").find_by!(name: "Shift").id
  end

  def regular_shift_category
    @regular_shift_category ||= Category.type("Shift").find_by!(name: "Regular")
  end

  def overlaps?(employee_id, starts_at, ends_at)
    @occupied[employee_id].any? do |existing_start, existing_end|
      starts_at < existing_end && ends_at > existing_start
    end
  end

  def covered?(client, date)
    @covered[[client.id, date]]
  end

  def cover_dates(client_id, starts_at, ends_at)
    first_date = starts_at.to_date
    last_date = (ends_at - 1.second).to_date
    (first_date..last_date).each do |date|
      @covered[[client_id, date]] = true
    end
  end

  def link_pay_periods
    cursor = @start_date
    while cursor <= @end_date
      period_start, period_end = Payroll::Period.period_dates(cursor)
      break if period_end.nil? || period_end < cursor

      PayPeriod.for_period_dates(period_start, period_end)
      cursor = period_end + 1.day
    end
  end

  def write_hour_columns(shift_ids)
    return 0 if shift_ids.empty?

    timesheet_ids = Shift.where(id: shift_ids).where.not(timesheet_id: nil).distinct.pluck(:timesheet_id)
    timesheets = Timesheet.where(id: timesheet_ids).includes(:pay_period).to_a
    timesheets.group_by(&:pay_period_id).each_value do |period_timesheets|
      pay_period = period_timesheets.first.pay_period
      summaries = Payroll::EmployeePeriodHours.call(pay_period, period_timesheets.map(&:employee_id))
      period_timesheets.each do |timesheet|
        hours = summaries[timesheet.employee_id.to_s] || {}
        timesheet.update!(
          total_regular_hours: hours[:regular_hours] || 0,
          total_ot_hours: hours[:ot_hours] || 0,
          total_sick_hours: 0,
          total_pto_hours: 0,
        )
      end
    end
    timesheets.size
  end
end
