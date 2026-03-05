# == Schema Information
#
# Table name: shifts
#
#  id                :uuid             not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_event_id :uuid             not null
#  employee_id       :uuid             not null
#  timesheet_id      :uuid
#
# Indexes
#
#  index_shifts_on_calendar_event_id  (calendar_event_id)
#  index_shifts_on_employee_id        (employee_id)
#  index_shifts_on_timesheet_id       (timesheet_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (timesheet_id => timesheets.id)
#
require "rails_helper"

RSpec.describe Shift do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:shift)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i().each do |attr|
        expect(build(:shift, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:employee) }
    it { is_expected.to belong_to(:calendar_event) }
    it { is_expected.to belong_to(:timesheet).optional }
  end

  describe "after_create :associate_with_timesheet_if_in_active_period" do
    around do |example|
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
      Setting.payroll_period_day = "monday"
      example.run
    end

    it "associates shift with a new timesheet when shift is in active period and no PayPeriod exists yet" do
      travel_to Date.new(2024, 3, 15) do
        active_start, active_end = Payroll::Period.period_dates(Date.current)
        period_start_dt = active_start.to_time.beginning_of_day
        period_end_dt = active_end.to_time.end_of_day
        employee = create(:employee)
        event = create(:calendar_event, starts_at: period_start_dt + 1.day, ends_at: period_start_dt + 1.day + 2.hours)

        shift = create(:shift, employee: employee, calendar_event: event)

        expect(PayPeriod.count).to eq(1)
        pay_period = PayPeriod.last
        expect(pay_period.starts_at).to eq(period_start_dt)
        expect(pay_period.ends_at.to_i).to eq(period_end_dt.to_i)
        timesheet = Timesheet.find_by(employee: employee, pay_period: pay_period)
        expect(timesheet).to be_present
        expect(shift.reload.timesheet_id).to eq(timesheet.id)
      end
    end

    it "associates shift with existing timesheet when PayPeriod and timesheet for employee already exist" do
      travel_to Date.new(2024, 3, 15) do
        active_start, active_end = Payroll::Period.period_dates(Date.current)
        period_start_dt = active_start.to_time.beginning_of_day
        period_end_dt = active_end.to_time.end_of_day
        pay_period = PayPeriod.create!(starts_at: period_start_dt, ends_at: period_end_dt)
        employee = create(:employee)
        timesheet = pay_period.timesheets.create!(employee: employee)
        event = create(:calendar_event, starts_at: period_start_dt + 1.day, ends_at: period_start_dt + 1.day + 2.hours)

        shift = create(:shift, employee: employee, calendar_event: event)

        expect(shift.reload.timesheet_id).to eq(timesheet.id)
        expect(PayPeriod.count).to eq(1)
      end
    end

    it "creates timesheet for employee when PayPeriod exists but no timesheet for that employee" do
      travel_to Date.new(2024, 3, 15) do
        active_start, active_end = Payroll::Period.period_dates(Date.current)
        period_start_dt = active_start.to_time.beginning_of_day
        period_end_dt = active_end.to_time.end_of_day
        pay_period = PayPeriod.create!(starts_at: period_start_dt, ends_at: period_end_dt)
        employee = create(:employee)
        event = create(:calendar_event, starts_at: period_start_dt + 1.day, ends_at: period_start_dt + 1.day + 2.hours)

        shift = create(:shift, employee: employee, calendar_event: event)

        timesheet = Timesheet.find_by(employee: employee, pay_period: pay_period)
        expect(timesheet).to be_present
        expect(shift.reload.timesheet_id).to eq(timesheet.id)
      end
    end

    it "does not associate when shift is before the active pay period" do
      travel_to Date.new(2024, 3, 15) do
        active_start, = Payroll::Period.period_dates(Date.current)
        employee = create(:employee)
        event_before = create(:calendar_event, starts_at: (active_start - 2.days).to_time.noon, ends_at: (active_start - 2.days).to_time.noon + 2.hours)

        shift = create(:shift, employee: employee, calendar_event: event_before)

        expect(shift.reload.timesheet_id).to be_nil
      end
    end

    it "does not associate when shift is after the active pay period" do
      travel_to Date.new(2024, 3, 15) do
        _, active_end = Payroll::Period.period_dates(Date.current)
        employee = create(:employee)
        event_after = create(:calendar_event, starts_at: (active_end + 1.day).to_time.noon, ends_at: (active_end + 1.day).to_time.noon + 2.hours)

        shift = create(:shift, employee: employee, calendar_event: event_after)

        expect(shift.reload.timesheet_id).to be_nil
      end
    end
  end
end
