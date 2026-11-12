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

  describe ".for_period_dates" do
    it "returns existing period when one overlaps the given dates" do
      period_start_date = Date.new(2024, 3, 11)
      period_end_date = Date.new(2024, 3, 24)
      existing = create(:pay_period, starts_at: period_start_date.to_time.beginning_of_day, ends_at: period_end_date.to_time.end_of_day)

      result = described_class.for_period_dates(period_start_date, period_end_date)

      expect(result.id).to eq(existing.id)
      expect(described_class.count).to eq(1)
    end

    it "merges overlapping periods and reassigns timesheets to the merged period" do
      period_start_date = Date.new(2024, 3, 1)
      period_end_date = Date.new(2024, 3, 31)
      first = create(:pay_period, starts_at: period_start_date.to_time.beginning_of_day, ends_at: Date.new(2024, 3, 14).to_time.end_of_day)
      second = create(:pay_period, starts_at: period_start_date.to_time.beginning_of_day, ends_at: Date.new(2024, 3, 20).to_time.end_of_day)
      employee = create(:employee)
      timesheet_first = create(:timesheet, employee: employee, pay_period: first)
      timesheet_second = create(:timesheet, employee: employee, pay_period: second)

      result = described_class.for_period_dates(period_start_date, period_end_date)

      expect(described_class.count).to eq(1)
      expect(result.id).to eq(first.id)
      expect(result.starts_at.to_date).to eq(period_start_date)
      expect(result.ends_at.to_date).to eq(period_end_date)
      expect(Timesheet.where(pay_period_id: result.id).pluck(:id)).to contain_exactly(timesheet_first.id, timesheet_second.id)
    end

    it "creates a new period when none overlaps and keeps neighbors contiguous" do
      previous = create(:pay_period, starts_at: Date.new(2024, 2, 1).to_time.beginning_of_day, ends_at: Date.new(2024, 2, 10).to_time.end_of_day)
      period_start_date = Date.new(2024, 2, 15)
      period_end_date = Date.new(2024, 2, 20)

      result = described_class.for_period_dates(period_start_date, period_end_date)

      expect(result).to be_persisted
      expect(result.starts_at.to_date).to eq(period_start_date)
      expect(result.ends_at.to_date).to eq(period_end_date)
      expect(previous.reload.ends_at.to_i).to eq(result.starts_at.to_i - 1)
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

  describe "#associate_orphan_shifts" do
    it "associates shifts that overlap the period but have nil timesheet_id" do
      period_start = 1.day.from_now.beginning_of_day
      period_end = 14.days.from_now.end_of_day
      pay_period = create(:pay_period, starts_at: period_start, ends_at: period_end)
      employee = create(:employee)
      event = create(:calendar_event, starts_at: period_start + 1.day, ends_at: period_start + 1.day + 8.hours)
      shift = create(:shift, employee: employee, calendar_event: event, timesheet: nil)
      shift.update_column(:timesheet_id, nil)

      pay_period.associate_orphan_shifts

      expect(shift.reload.timesheet_id).to eq(pay_period.timesheets.find_by(employee: employee).id)
    end

    it "is a no-op when no orphan shifts overlap the period" do
      period_start = 1.day.from_now.beginning_of_day
      period_end = 14.days.from_now.end_of_day
      pay_period = create(:pay_period, starts_at: period_start, ends_at: period_end)

      expect { pay_period.associate_orphan_shifts }.not_to raise_error
      expect(pay_period.timesheets.count).to eq(0)
    end
  end

  describe "destroying with associated timesheets" do
    it "does not allow destroying when any associated timesheet is approved" do
      pay_period = create(:pay_period)
      create(:timesheet, pay_period: pay_period, approved_at: Date.current)

      expect { pay_period.destroy }.not_to change(described_class, :count)
      expect(pay_period.errors[:base]).to include("cannot delete pay period with approved timesheets")
      expect(pay_period.reload.timesheets.count).to eq(1)
    end

    it "destroys unapproved timesheets when destroying the pay period" do
      pay_period = create(:pay_period)
      create_list(:timesheet, 2, pay_period: pay_period, approved_at: nil)

      expect {
        pay_period.destroy
      }.to change(described_class, :count).by(-1).and change(Timesheet, :count).by(-2)
    end
  end
end
