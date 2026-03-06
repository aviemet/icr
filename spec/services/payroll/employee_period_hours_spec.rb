# frozen_string_literal: true

require "rails_helper"

RSpec.describe Payroll::EmployeePeriodHours do
  before do
    Setting.payroll_period_day = "monday"
    Setting.overtime_weekly_hours = 40
    Setting.overtime_daily_hours = 8
  end

  describe ".call" do
    it "returns empty hash when employee_ids is empty" do
      pay_period = create(:pay_period, starts_at: Time.zone.local(2024, 3, 11, 0, 0, 0), ends_at: Time.zone.local(2024, 3, 24, 23, 59, 59))

      result = described_class.call(pay_period, [])

      expect(result).to eq({})
    end

    it "returns regular_hours and ot_hours for an employee with one same-day shift" do
      period_start = Time.zone.local(2024, 3, 11, 0, 0, 0)
      period_end = Time.zone.local(2024, 3, 24, 23, 59, 59)
      pay_period = create(:pay_period, starts_at: period_start, ends_at: period_end)
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      event = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0), ends_at: Time.zone.local(2024, 3, 15, 17, 0, 0))
      create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)

      result = described_class.call(pay_period, [employee.id])

      expect(result).to have_key(employee.id.to_s)
      expect(result[employee.id.to_s][:regular_hours]).to eq(8.0)
      expect(result[employee.id.to_s][:ot_hours]).to eq(0.0)
    end

    it "splits overnight shift across two days and calculates hours correctly" do
      period_start = Time.zone.local(2024, 3, 11, 0, 0, 0)
      period_end = Time.zone.local(2024, 3, 24, 23, 59, 59)
      pay_period = create(:pay_period, starts_at: period_start, ends_at: period_end)
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      event = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 15, 22, 0, 0), ends_at: Time.zone.local(2024, 3, 16, 6, 0, 0))
      create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)

      result = described_class.call(pay_period, [employee.id])

      expect(result[employee.id.to_s][:regular_hours]).to eq(8.0)
      expect(result[employee.id.to_s][:ot_hours]).to eq(0.0)
    end

    it "does not infinite loop when processing shifts" do
      period_start = Time.zone.local(2024, 3, 11, 0, 0, 0)
      period_end = Time.zone.local(2024, 3, 24, 23, 59, 59)
      pay_period = create(:pay_period, starts_at: period_start, ends_at: period_end)
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      event = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0), ends_at: Time.zone.local(2024, 3, 15, 17, 0, 0))
      create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)

      result = nil
      expect { result = described_class.call(pay_period, [employee.id]) }.not_to raise_error
      expect(result).to be_a(Hash)
      expect(result[employee.id.to_s]).to include(:regular_hours, :ot_hours)
    end
  end
end
