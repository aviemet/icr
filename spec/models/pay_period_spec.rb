# == Schema Information
#
# Table name: pay_periods
#
#  id              :uuid             not null, primary key
#  approved_at     :datetime
#  config_snapshot :jsonb
#  ends_at         :datetime
#  period_type     :integer
#  starts_at       :datetime
#  status          :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_pay_periods_on_starts_at_and_ends_at  (starts_at,ends_at) UNIQUE
#
require "rails_helper"

RSpec.describe PayPeriod, type: :model do
  describe "after_create :backfill_timesheets_from_shifts" do
    it "creates one timesheet per employee with shifts overlapping the period and associates those shifts" do
      period_start = 1.day.from_now.beginning_of_day
      period_end = 14.days.from_now.end_of_day
      employee_a = create(:employee)
      employee_b = create(:employee)
      event_a = create(:calendar_event, starts_at: period_start + 1.day, ends_at: period_start + 1.day + 2.hours)
      event_b = create(:calendar_event, starts_at: period_start + 2.days, ends_at: period_start + 2.days + 2.hours)
      shift_a = create(:shift, employee: employee_a, calendar_event: event_a)
      shift_b = create(:shift, employee: employee_b, calendar_event: event_b)

      pay_period = described_class.create!(starts_at: period_start, ends_at: period_end)

      expect(pay_period.timesheets.count).to eq(2)
      timesheet_a = pay_period.timesheets.find_by(employee: employee_a)
      timesheet_b = pay_period.timesheets.find_by(employee: employee_b)
      expect(timesheet_a).to be_present
      expect(timesheet_b).to be_present
      expect(shift_a.reload.timesheet_id).to eq(timesheet_a.id)
      expect(shift_b.reload.timesheet_id).to eq(timesheet_b.id)
    end

    it "creates one timesheet per employee when one employee has multiple shifts in the period" do
      period_start = 1.day.from_now.beginning_of_day
      period_end = 14.days.from_now.end_of_day
      employee = create(:employee)
      event1 = create(:calendar_event, starts_at: period_start + 1.day, ends_at: period_start + 1.day + 2.hours)
      event2 = create(:calendar_event, starts_at: period_start + 3.days, ends_at: period_start + 3.days + 2.hours)
      shift1 = create(:shift, employee: employee, calendar_event: event1)
      shift2 = create(:shift, employee: employee, calendar_event: event2)

      pay_period = described_class.create!(starts_at: period_start, ends_at: period_end)

      expect(pay_period.timesheets.count).to eq(1)
      timesheet = pay_period.timesheets.find_by(employee: employee)
      expect(timesheet.shifts).to contain_exactly(shift1, shift2)
      expect(shift1.reload.timesheet_id).to eq(timesheet.id)
      expect(shift2.reload.timesheet_id).to eq(timesheet.id)
    end

    it "creates no timesheets when no shifts overlap the period" do
      period_start = 1.day.from_now.beginning_of_day
      period_end = 14.days.from_now.end_of_day

      pay_period = described_class.create!(starts_at: period_start, ends_at: period_end)

      expect(pay_period.timesheets.count).to eq(0)
    end

    it "includes shifts whose event starts before the period and ends within it" do
      period_start = 1.day.from_now.beginning_of_day
      period_end = 14.days.from_now.end_of_day
      employee = create(:employee)
      event = create(:calendar_event, starts_at: period_start - 2.hours, ends_at: period_start + 1.hour)
      shift = create(:shift, employee: employee, calendar_event: event)

      pay_period = described_class.create!(starts_at: period_start, ends_at: period_end)

      expect(pay_period.timesheets.count).to eq(1)
      expect(shift.reload.timesheet_id).to eq(pay_period.timesheets.find_by(employee: employee).id)
    end

    it "includes shifts whose event starts within the period and ends after it" do
      period_start = 1.day.from_now.beginning_of_day
      period_end = 14.days.from_now.end_of_day
      employee = create(:employee)
      event = create(:calendar_event, starts_at: period_end - 2.hours, ends_at: period_end + 1.hour)
      shift = create(:shift, employee: employee, calendar_event: event)

      pay_period = described_class.create!(starts_at: period_start, ends_at: period_end)

      expect(pay_period.timesheets.count).to eq(1)
      expect(shift.reload.timesheet_id).to eq(pay_period.timesheets.find_by(employee: employee).id)
    end

    it "excludes shifts whose event is entirely before the period" do
      period_start = Time.zone.local(2024, 4, 1, 0, 0, 0)
      period_end = Time.zone.local(2024, 4, 14, 23, 59, 59)
      employee = create(:employee)
      event = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 10, 12, 0, 0), ends_at: Time.zone.local(2024, 3, 10, 14, 0, 0))
      shift = nil
      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        shift = create(:shift, employee: employee, calendar_event: event)
      end

      pay_period = described_class.create!(starts_at: period_start, ends_at: period_end)

      expect(pay_period.timesheets.count).to eq(0)
      expect(shift.reload.timesheet_id).to be_nil
    end

    it "excludes shifts whose event is entirely after the period" do
      period_start = Time.zone.local(2024, 3, 1, 0, 0, 0)
      period_end = Time.zone.local(2024, 3, 14, 23, 59, 59)
      employee = create(:employee)
      event = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 20, 12, 0, 0), ends_at: Time.zone.local(2024, 3, 20, 14, 0, 0))
      shift = nil
      travel_to Time.zone.local(2024, 3, 5, 12, 0, 0) do
        shift = create(:shift, employee: employee, calendar_event: event)
      end

      pay_period = described_class.create!(starts_at: period_start, ends_at: period_end)

      expect(pay_period.timesheets.count).to eq(0)
      expect(shift.reload.timesheet_id).to be_nil
    end
  end

  describe ".shifts_overlapping_period" do
    it "returns shifts whose calendar_event overlaps the given period" do
      period_start = 2.days.from_now.beginning_of_day
      period_end = 9.days.from_now.end_of_day
      pay_period = create(:pay_period, starts_at: period_start, ends_at: period_end)
      inside = create(:shift, calendar_event: create(:calendar_event, starts_at: period_start + 1.day, ends_at: period_start + 1.day + 1.hour))
      overlapping_start = create(:shift, calendar_event: create(:calendar_event, starts_at: period_start - 1.hour, ends_at: period_start + 1.hour))
      overlapping_end = create(:shift, calendar_event: create(:calendar_event, starts_at: period_end - 1.hour, ends_at: period_end + 1.hour))
      before = create(:shift, calendar_event: create(:calendar_event, starts_at: period_start - 2.days, ends_at: period_start - 2.days + 1.hour))
      after = create(:shift, calendar_event: create(:calendar_event, starts_at: period_end + 1.day, ends_at: period_end + 1.day + 1.hour))

      result = described_class.shifts_overlapping_period(pay_period)

      expect(result).to include(inside, overlapping_start, overlapping_end)
      expect(result).not_to include(before, after)
    end
  end
end
