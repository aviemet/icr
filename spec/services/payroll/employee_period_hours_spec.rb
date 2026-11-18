# frozen_string_literal: true

require "rails_helper"

RSpec.describe Payroll::EmployeePeriodHours do
  before do
    Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
    Setting.payroll_period_day = "monday"
    Setting.overtime_weekly_hours = 40
    Setting.overtime_daily_hours = 8
  end

  def pay_period_for(date)
    period_start, period_end = Payroll::Period.period_dates(date)
    PayPeriod.for_period_dates(period_start, period_end)
  end

  describe ".call" do
    it "returns empty hash when employee_ids is empty" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))

      result = described_class.call(pay_period, [])

      expect(result).to eq({})
    end

    it "returns regular_hours, ot_hours, and shift_ot_hours for an employee with one same-day shift" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      event = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0), ends_at: Time.zone.local(2024, 3, 15, 17, 0, 0))
      shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)

      result = described_class.call(pay_period, [employee.id])

      expect(result).to have_key(employee.id.to_s)
      expect(result[employee.id.to_s][:regular_hours]).to eq(8.0)
      expect(result[employee.id.to_s][:ot_hours]).to eq(0.0)
      expect(result[employee.id.to_s][:shift_ot_hours]).to eq(shift.id.to_s => 0.0)
    end

    it "splits overnight shift across two days and applies threshold OT only after daily totals exceed 8" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      event = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 15, 22, 0, 0), ends_at: Time.zone.local(2024, 3, 16, 6, 0, 0))
      shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)

      result = described_class.call(pay_period, [employee.id])

      expect(result[employee.id.to_s][:regular_hours]).to eq(8.0)
      expect(result[employee.id.to_s][:ot_hours]).to eq(0.0)
      expect(result[employee.id.to_s][:shift_ot_hours][shift.id.to_s]).to eq(0.0)
    end

    it "attributes daily OT on the morning side of an overnight shift that exceeds the daily threshold" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      event = create(
        :calendar_event,
        starts_at: Time.zone.local(2024, 3, 15, 20, 0, 0),
        ends_at: Time.zone.local(2024, 3, 16, 10, 0, 0),
      )
      shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)

      result = described_class.call(pay_period, [employee.id])

      expect(result[employee.id.to_s][:regular_hours]).to eq(12.0)
      expect(result[employee.id.to_s][:ot_hours]).to eq(2.0)
      expect(result[employee.id.to_s][:shift_ot_hours][shift.id.to_s]).to eq(2.0)
    end

    it "treats an evening shift that ends at midnight as regular when the day stays at 8 hours" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      event = create(
        :calendar_event,
        starts_at: Time.zone.local(2024, 3, 15, 16, 0, 0),
        ends_at: Time.zone.local(2024, 3, 16, 0, 0, 0),
      )
      shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)

      result = described_class.call(pay_period, [employee.id])

      expect(result[employee.id.to_s][:regular_hours]).to eq(8.0)
      expect(result[employee.id.to_s][:ot_hours]).to eq(0.0)
      expect(result[employee.id.to_s][:shift_ot_hours][shift.id.to_s]).to eq(0.0)
    end

    it "includes shift_ot_hours for the shift when daily threshold is exceeded" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      event = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0), ends_at: Time.zone.local(2024, 3, 15, 19, 0, 0))
      shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)

      result = described_class.call(pay_period, [employee.id])

      expect(result[employee.id.to_s][:shift_ot_hours][shift.id.to_s]).to eq(2.0)
    end

    it "splits shift_ot_hours proportionally when multiple shifts exceed daily threshold the same day" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      event1 = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0), ends_at: Time.zone.local(2024, 3, 15, 14, 0, 0))
      event2 = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 15, 14, 0, 0), ends_at: Time.zone.local(2024, 3, 15, 19, 0, 0))
      shift1 = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event1)
      shift2 = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event2)

      result = described_class.call(pay_period, [employee.id])

      expect(result[employee.id.to_s][:shift_ot_hours][shift1.id.to_s]).to eq(1.0)
      expect(result[employee.id.to_s][:shift_ot_hours][shift2.id.to_s]).to eq(1.0)
    end

    it "does not infinite loop when processing shifts" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      event = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0), ends_at: Time.zone.local(2024, 3, 15, 17, 0, 0))
      create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)

      result = nil
      expect { result = described_class.call(pay_period, [employee.id]) }.not_to raise_error
      expect(result).to be_a(Hash)
      expect(result[employee.id.to_s]).to include(:regular_hours, :ot_hours, :shift_ot_hours)
    end

    it "can compute hours from a collector without timesheets or shifts" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)

      interval = Payroll::WorkInterval.new(
        employee_id: employee.id,
        starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 15, 18, 0, 0),
        category: nil
      )

      collector = Class.new(Payroll::WorkIntervalCollector) do
        def initialize(intervals)
          @intervals = intervals
        end

        def intervals_for(pay_period:, employee_ids:)
          @intervals.select { |work_interval| employee_ids.include?(work_interval.employee_id) }
        end
      end.new([interval])

      result = described_class.call(pay_period, [employee.id], collector: collector)

      expect(result[employee.id.to_s][:regular_hours]).to eq(8.0)
      expect(result[employee.id.to_s][:ot_hours]).to eq(1.0)
    end
  end
end
