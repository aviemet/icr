# frozen_string_literal: true

require "rails_helper"

# == Schema Information
#
# Table name: shifts
#
#  id                      :uuid             not null, primary key
#  facilitator_approved_at :date
#  ihss                    :boolean          default(FALSE), not null
#  mileage                 :decimal(8, 2)
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  calendar_event_id       :uuid             not null
#  category_id             :uuid
#  employee_id             :uuid
#  service_type_id         :uuid             not null
#  timesheet_id            :uuid
#
# Indexes
#
#  index_shifts_on_calendar_event_id  (calendar_event_id) UNIQUE
#  index_shifts_on_category_id        (category_id)
#  index_shifts_on_employee_id        (employee_id)
#  index_shifts_on_service_type_id    (service_type_id)
#  index_shifts_on_timesheet_id       (timesheet_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (service_type_id => service_types.id)
#  fk_rails_...  (timesheet_id => timesheets.id)
#
RSpec.describe Shift, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:employee).optional }
    it { is_expected.to belong_to(:timesheet).optional }
  end

  describe "open shifts" do
    it "persists without an employee" do
      event = create(:calendar_event, starts_at: 1.day.from_now, ends_at: 1.day.from_now + 2.hours)
      shift = create(:shift, :open, calendar_event: event)

      expect(shift).to be_open
      expect(shift.employee_id).to be_nil
      expect(shift.timesheet_id).to be_nil
    end

    it "normalizes blank employee_id to nil" do
      event = create(:calendar_event, starts_at: 1.day.from_now, ends_at: 1.day.from_now + 2.hours)
      shift = build(:shift, calendar_event: event, employee: nil)
      shift.employee_id = ""

      expect(shift).to be_valid
      expect(shift.employee_id).to be_nil
    end
  end

  describe "after_create :attach_to_containing_pay_period" do
    around do |example|
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
      Setting.payroll_period_day = "monday"
      example.run
    end

    it "associates shift with a new timesheet when no PayPeriod exists yet" do
      travel_to Date.new(2024, 3, 15) do
        period_start, period_end = Payroll::Period.period_dates(Date.current)
        period_start_dt = period_start.to_time.beginning_of_day
        period_end_dt = period_end.to_time.end_of_day
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
        period_start, period_end = Payroll::Period.period_dates(Date.current)
        period_start_dt = period_start.to_time.beginning_of_day
        period_end_dt = period_end.to_time.end_of_day
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
        period_start, period_end = Payroll::Period.period_dates(Date.current)
        period_start_dt = period_start.to_time.beginning_of_day
        period_end_dt = period_end.to_time.end_of_day
        pay_period = PayPeriod.create!(starts_at: period_start_dt, ends_at: period_end_dt)
        employee = create(:employee)
        event = create(:calendar_event, starts_at: period_start_dt + 1.day, ends_at: period_start_dt + 1.day + 2.hours)

        shift = create(:shift, employee: employee, calendar_event: event)

        timesheet = Timesheet.find_by(employee: employee, pay_period: pay_period)
        expect(timesheet).to be_present
        expect(shift.reload.timesheet_id).to eq(timesheet.id)
      end
    end

    it "attaches a future shift to the pay period that contains it" do
      travel_to Date.new(2024, 3, 15) do
        _, active_end = Payroll::Period.period_dates(Date.current)
        future_start, future_end = Payroll::Period.period_dates(active_end + 1.day)
        employee = create(:employee)
        event_after = create(
          :calendar_event,
          starts_at: future_start.to_time.noon,
          ends_at: future_start.to_time.noon + 2.hours,
        )

        shift = create(:shift, employee: employee, calendar_event: event_after)

        pay_period = shift.reload.timesheet.pay_period
        expect(pay_period.starts_at.to_date).to eq(future_start)
        expect(pay_period.ends_at.to_date).to eq(future_end)
      end
    end

    it "attaches a past shift to the pay period that contains it" do
      travel_to Date.new(2024, 3, 15) do
        active_start, = Payroll::Period.period_dates(Date.current)
        past_start, past_end = Payroll::Period.period_dates(active_start - 1.day)
        employee = create(:employee)
        event_before = create(
          :calendar_event,
          starts_at: past_start.to_time.noon,
          ends_at: past_start.to_time.noon + 2.hours,
        )

        shift = create(:shift, employee: employee, calendar_event: event_before)

        pay_period = shift.reload.timesheet.pay_period
        expect(pay_period.starts_at.to_date).to eq(past_start)
        expect(pay_period.ends_at.to_date).to eq(past_end)
      end
    end
  end
end
