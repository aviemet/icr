# frozen_string_literal: true

require "rails_helper"

RSpec.describe Payroll::Hours::Engine do
  before do
    Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
    Setting.payroll_period_day = "monday"
    Setting.overtime_workweek_start = "monday"
    Setting.overtime_weekly_hours = 40
    Setting.overtime_daily_hours = 8
    Setting.overtime_daily_double_time_hours = 12
    Setting.overtime_seventh_day_double_time_hours = 8
    Setting.overtime_personal_attendant_daily_hours = 9
    Setting.overtime_personal_attendant_weekly_hours = 45
    Setting.ihss_co_employer = true
  end

  def pay_period_for(date)
    period_start, period_end = Payroll::Period.period_dates(date)
    PayPeriod.for_period_dates(period_start, period_end)
  end

  def stub_collector(intervals)
    Class.new(Payroll::WorkIntervalCollector) do
      def initialize(rows)
        @intervals = rows
      end

      def intervals_for(pay_period:, employee_ids:, range_start: nil, range_end: nil) # rubocop:disable Lint/UnusedMethodArgument
        @intervals.select { |work_interval| employee_ids.include?(work_interval.employee_id) }
      end
    end.new(intervals)
  end

  def work_interval(employee, date, start_hour, end_hour, **attrs)
    end_date = attrs[:end_date] || date
    Payroll::WorkInterval.new(
      id: attrs[:id] || SecureRandom.uuid,
      employee_id: employee.id,
      starts_at: Time.zone.local(date.year, date.month, date.day, start_hour, 0, 0),
      ends_at: Time.zone.local(end_date.year, end_date.month, end_date.day, end_hour, 0, 0),
      category: attrs[:category],
      ihss: attrs.fetch(:ihss, false),
      client_ids: attrs[:client_ids] || [],
      consuming_client_id: attrs[:consuming_client_id],
    )
  end

  it "counts criteria-exempt hours as regular straight time" do
    pay_period = pay_period_for(Date.new(2024, 3, 15))
    employee = create(:employee)
    service_type = create(:service_type, name: "Sleep Shift", slug: "sleep-shift")
    create(
      :overtime_exemption,
      name: "Sleep exempt",
      active: true,
      criteria: [{ "category" => { "operator" => "equals", "value" => service_type.slug } }],
    )
    intervals = [work_interval(employee, Date.new(2024, 3, 15), 9, 21, category: service_type)]

    result = described_class.call(pay_period, [employee.id], collector: stub_collector(intervals))

    expect(result[employee.id.to_s]).to include(
      regular_hours: 12.0,
      ot_hours: 0.0,
      double_time_hours: 0.0,
      company_hours: 12.0,
    )
  end

  it "applies personal attendant thresholds from settings without double-time or seventh-day premiums" do
    pay_period = pay_period_for(Date.new(2024, 3, 11))
    employee = create(:employee, overtime_policy: :personal_attendant)
    intervals = [
      work_interval(employee, Date.new(2024, 3, 11), 8, 21, id: "mon"),
      * (1..5).map { |offset|
        date = Date.new(2024, 3, 11) + offset
        work_interval(employee, date, 9, 17, id: "day-#{offset}")
      },
    ]

    result = described_class.call(pay_period, [employee.id], collector: stub_collector(intervals))
    hours = result[employee.id.to_s]

    expect(hours[:shift_ot_hours]["mon"]).to eq(4.0)
    expect(hours[:double_time_hours]).to eq(0.0)
    expect(hours[:ot_hours]).to eq(8.0)
  end

  it "uses personal attendant daily threshold from settings" do
    Setting.overtime_personal_attendant_daily_hours = 10
    pay_period = pay_period_for(Date.new(2024, 3, 15))
    employee = create(:employee, overtime_policy: :personal_attendant)
    intervals = [work_interval(employee, Date.new(2024, 3, 15), 8, 20, id: "long")]

    result = described_class.call(pay_period, [employee.id], collector: stub_collector(intervals))
    hours = result[employee.id.to_s]

    expect(hours[:regular_hours]).to eq(10.0)
    expect(hours[:ot_hours]).to eq(2.0)
    expect(hours[:double_time_hours]).to eq(0.0)
  end

  it "applies standard double-time after twelve hours" do
    pay_period = pay_period_for(Date.new(2024, 3, 15))
    employee = create(:employee, overtime_policy: :standard)
    intervals = [work_interval(employee, Date.new(2024, 3, 15), 6, 20, id: "long")]

    result = described_class.call(pay_period, [employee.id], collector: stub_collector(intervals))
    hours = result[employee.id.to_s]

    expect(hours[:regular_hours]).to eq(8.0)
    expect(hours[:ot_hours]).to eq(4.0)
    expect(hours[:double_time_hours]).to eq(2.0)
    expect(hours[:shift_double_time_hours]["long"]).to eq(2.0)
  end

  it "applies seventh-day premiums for the standard policy" do
    pay_period = pay_period_for(Date.new(2024, 3, 11))
    employee = create(:employee, overtime_policy: :standard)
    intervals = (0..6).map do |offset|
      date = Date.new(2024, 3, 11) + offset
      work_interval(employee, date, 9, 19, id: "day-#{offset}")
    end

    result = described_class.call(pay_period, [employee.id], collector: stub_collector(intervals))
    hours = result[employee.id.to_s]

    expect(hours[:shift_ot_hours]["day-6"]).to eq(8.0)
    expect(hours[:shift_double_time_hours]["day-6"]).to eq(2.0)
  end

  it "uses the seventh-day double-time threshold from settings" do
    Setting.overtime_seventh_day_double_time_hours = 6
    pay_period = pay_period_for(Date.new(2024, 3, 11))
    employee = create(:employee, overtime_policy: :standard)
    intervals = (0..6).map do |offset|
      date = Date.new(2024, 3, 11) + offset
      work_interval(employee, date, 9, 17, id: "day-#{offset}")
    end

    result = described_class.call(pay_period, [employee.id], collector: stub_collector(intervals))
    hours = result[employee.id.to_s]

    expect(hours[:shift_ot_hours]["day-6"]).to eq(6.0)
    expect(hours[:shift_double_time_hours]["day-6"]).to eq(2.0)
  end

  describe "shifts that cross a pay period boundary" do
    it "reports overtime once, in the period of the workday that earned it" do
      period_a = pay_period_for(Date.new(2024, 3, 11))
      period_b = pay_period_for(Date.new(2024, 3, 18))
      employee = create(:employee)
      overnight = work_interval(
        employee, Date.new(2024, 3, 17), 14, 4, id: "overnight", end_date: Date.new(2024, 3, 18),
      )
      collector = stub_collector([overnight])

      hours_a = described_class.call(period_a, [employee.id], collector: collector)[employee.id.to_s]
      hours_b = described_class.call(period_b, [employee.id], collector: collector)[employee.id.to_s]

      expect(hours_a).to include(regular_hours: 8.0, ot_hours: 2.0, company_hours: 10.0)
      expect(hours_a[:shift_ot_hours]["overnight"]).to eq(2.0)
      expect(hours_b).to include(regular_hours: 4.0, ot_hours: 0.0, company_hours: 4.0)
      expect(hours_b[:shift_ot_hours]["overnight"]).to eq(0.0)
    end

    it "keeps an exempt shift regular in both periods without double-counting" do
      period_a = pay_period_for(Date.new(2024, 3, 11))
      period_b = pay_period_for(Date.new(2024, 3, 18))
      employee = create(:employee)
      service_type = create(:service_type, name: "Overnight Sleep", slug: "overnight-sleep")
      create(
        :overtime_exemption,
        name: "Overnight sleep",
        active: true,
        criteria: [
          {
            "category" => { "operator" => "equals", "value" => service_type.slug },
            "duration" => { "operator" => "greater_than", "value" => 12 },
          },
        ],
      )
      overnight = work_interval(
        employee, Date.new(2024, 3, 17), 14, 4, id: "overnight", end_date: Date.new(2024, 3, 18), category: service_type,
      )
      collector = stub_collector([overnight])

      hours_a = described_class.call(period_a, [employee.id], collector: collector)[employee.id.to_s]
      hours_b = described_class.call(period_b, [employee.id], collector: collector)[employee.id.to_s]

      expect(hours_a).to include(regular_hours: 10.0, ot_hours: 0.0, double_time_hours: 0.0)
      expect(hours_b).to include(regular_hours: 4.0, ot_hours: 0.0, double_time_hours: 0.0)
    end
  end

  describe "period-mode IHSS" do
    before do
      Setting.ihss_assignment_mode = "period"
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]
    end

    it "classifies lookback days against their own period and matches ClientPeriodIhssHours" do
      prior_period = PayPeriod.for_period_dates(Date.new(2024, 3, 1), Date.new(2024, 3, 15))
      pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 16), Date.new(2024, 3, 31))
      employee = create(:employee)
      client = create(:client)
      Payroll::IhssPeriodAssignment.create!(pay_period: pay_period, employee: employee, client: client, hours: 12)
      prior_timesheet = create(:timesheet, pay_period: prior_period, employee: employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)

      [
        [prior_timesheet, Time.zone.local(2024, 3, 14, 9, 0, 0), 8],
        [prior_timesheet, Time.zone.local(2024, 3, 15, 20, 0, 0), 8],
        [timesheet, Time.zone.local(2024, 3, 18, 9, 0, 0), 8],
      ].each do |shift_timesheet, starts_at, hours|
        event = create(:calendar_event, starts_at: starts_at, ends_at: starts_at + hours.hours)
        event.event_participants.create!(participant: client)
        create(:shift, employee: employee, timesheet: shift_timesheet, calendar_event: event, ihss: false)
      end

      hours = described_class.call(pay_period, [employee.id])[employee.id.to_s]
      client_hours = Payroll::ClientPeriodIhssHours.call(pay_period: pay_period, client_ids: [client.id])

      expect(hours[:client_ihss_hours][client.id.to_s]).to eq(12.0)
      expect(hours[:ihss_hours]).to eq(12.0)
      expect(hours[:company_hours]).to eq(0.0)
      expect(client_hours[client.id.to_s]).to eq(hours[:client_ihss_hours][client.id.to_s])
    end
  end

  it "uses lookback hours outside the period for weekly OT inside the period" do
    Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]
    pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 16), Date.new(2024, 3, 31))
    employee = create(:employee)
    prior = (11..15).map do |day|
      date = Date.new(2024, 3, day)
      work_interval(employee, date, 9, 17, id: "prior-#{day}")
    end
    thursday = work_interval(employee, Date.new(2024, 3, 16), 9, 17, id: "thu")

    result = described_class.call(
      pay_period,
      [employee.id],
      collector: stub_collector([*prior, thursday]),
    )
    hours = result[employee.id.to_s]

    expect(hours[:shift_ot_hours]["thu"]).to eq(8.0)
    expect(hours[:ot_hours]).to eq(8.0)
    expect(hours[:regular_hours]).to eq(0.0)
  end
end
