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
    Payroll::WorkInterval.new(
      id: attrs[:id] || SecureRandom.uuid,
      employee_id: employee.id,
      starts_at: Time.zone.local(date.year, date.month, date.day, start_hour, 0, 0),
      ends_at: Time.zone.local(date.year, date.month, date.day, end_hour, 0, 0),
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
