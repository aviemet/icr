# == Schema Information
#
# Table name: pay_periods
#
#  id              :uuid             not null, primary key
#  approved_at     :datetime
#  config_snapshot :jsonb
#  ends_at         :datetime
#  finalized_at    :datetime
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
  describe "after_create :sync_shifts!" do
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

    it "does not pull in shifts whose event is entirely before the period" do
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
      expect(shift.reload.timesheet.pay_period_id).not_to eq(pay_period.id)
    end

    it "does not pull in shifts whose event is entirely after the period" do
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
      expect(shift.reload.timesheet.pay_period_id).not_to eq(pay_period.id)
    end
  end

  describe ".for_period_dates" do
    it "returns existing period when one starts on the same day" do
      period_start_date = Date.new(2024, 3, 11)
      period_end_date = Date.new(2024, 3, 24)
      existing = create(:pay_period, starts_at: period_start_date.to_time.beginning_of_day, ends_at: period_end_date.to_time.end_of_day)

      result = described_class.for_period_dates(period_start_date, period_end_date)

      expect(result.id).to eq(existing.id)
      expect(described_class.count).to eq(1)
    end

    it "snaps an existing same-start period to the requested end date" do
      period_start_date = Date.new(2024, 11, 1)
      existing = create(
        :pay_period,
        starts_at: period_start_date.to_time.beginning_of_day,
        ends_at: Date.new(2024, 11, 30).to_time.end_of_day,
      )

      result = described_class.for_period_dates(period_start_date, Date.new(2024, 11, 15))

      expect(result.id).to eq(existing.id)
      expect(result.starts_at.to_date).to eq(Date.new(2024, 11, 1))
      expect(result.ends_at.to_date).to eq(Date.new(2024, 11, 15))
    end

    it "merges same-start periods and reassigns timesheets to the requested range" do
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

    it "creates a new period for a different start day and shrinks an overlapping predecessor" do
      oversized = create(
        :pay_period,
        starts_at: Date.new(2024, 11, 1).to_time.beginning_of_day,
        ends_at: Date.new(2024, 11, 30).to_time.end_of_day,
      )

      result = described_class.for_period_dates(Date.new(2024, 11, 16), Date.new(2024, 11, 30))

      expect(result.starts_at.to_date).to eq(Date.new(2024, 11, 16))
      expect(result.ends_at.to_date).to eq(Date.new(2024, 11, 30))
      expect(oversized.reload.ends_at.to_date).to eq(Date.new(2024, 11, 15))
    end

    it "creates a new period when none shares the start day and keeps neighbors contiguous" do
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

  describe ".attach_shift!" do
    around do |example|
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]
      example.run
    end

    it "creates the containing pay period and attaches the shift" do
      travel_to Time.zone.local(2024, 3, 10, 12, 0, 0) do
        employee = create(:employee)
        shift = create(
          :shift,
          employee: employee,
          calendar_event: create(
            :calendar_event,
            starts_at: Time.zone.local(2024, 3, 20, 9, 0, 0),
            ends_at: Time.zone.local(2024, 3, 20, 17, 0, 0),
          ),
        )

        pay_period = shift.reload.timesheet.pay_period
        expect(pay_period.starts_at.to_date).to eq(Date.new(2024, 3, 16))
        expect(pay_period.ends_at.to_date).to eq(Date.new(2024, 3, 31))
      end
    end

    it "skips open shifts without an employee" do
      travel_to Time.zone.local(2024, 3, 10, 12, 0, 0) do
        expect {
          create(
            :shift,
            :open,
            calendar_event: create(
              :calendar_event,
              starts_at: Time.zone.local(2024, 3, 20, 9, 0, 0),
              ends_at: Time.zone.local(2024, 3, 20, 17, 0, 0),
            ),
          )
        }.not_to change(described_class, :count)
      end
    end
  end

  describe "#sync_shifts!" do
    it "associates shifts that overlap the period but have nil timesheet_id" do
      period_start = 1.day.from_now.beginning_of_day
      period_end = 14.days.from_now.end_of_day
      pay_period = create(:pay_period, starts_at: period_start, ends_at: period_end)
      employee = create(:employee)
      event = create(:calendar_event, starts_at: period_start + 1.day, ends_at: period_start + 1.day + 8.hours)
      shift = create(:shift, employee: employee, calendar_event: event, timesheet: nil)
      shift.update_column(:timesheet_id, nil) # rubocop:disable Rails/SkipsModelValidations

      pay_period.sync_shifts!

      expect(shift.reload.timesheet_id).to eq(pay_period.timesheets.find_by(employee: employee).id)
    end

    it "reassigns shifts that overlap the period but belong to another pay period" do
      period_start = Time.zone.local(2024, 3, 16).beginning_of_day
      period_end = Time.zone.local(2024, 3, 31).end_of_day
      pay_period = create(:pay_period, starts_at: period_start, ends_at: period_end)
      other_period = create(
        :pay_period,
        starts_at: Time.zone.local(2024, 3, 1).beginning_of_day,
        ends_at: Time.zone.local(2024, 3, 15).end_of_day,
      )
      employee = create(:employee)
      wrong_timesheet = other_period.timesheets.create!(employee: employee)
      event = create(:calendar_event, starts_at: period_start + 1.day, ends_at: period_start + 1.day + 8.hours)
      shift = create(:shift, employee: employee, calendar_event: event, timesheet: wrong_timesheet)

      pay_period.sync_shifts!

      expect(shift.reload.timesheet.pay_period_id).to eq(pay_period.id)
    end

    it "is a no-op when no shifts overlap the period" do
      period_start = 1.day.from_now.beginning_of_day
      period_end = 14.days.from_now.end_of_day
      pay_period = create(:pay_period, starts_at: period_start, ends_at: period_end)

      expect { pay_period.sync_shifts! }.not_to raise_error
      expect(pay_period.timesheets.count).to eq(0)
    end
  end

  describe "#reattach_out_of_range_shifts!" do
    around do |example|
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]
      example.run
    end

    it "moves shifts onto their containing period" do
      travel_to Time.zone.local(2024, 3, 10, 12, 0, 0) do
        first_half = create(
          :pay_period,
          starts_at: Date.new(2024, 3, 1).to_time.beginning_of_day,
          ends_at: Date.new(2024, 3, 15).to_time.end_of_day,
        )
        employee = create(:employee)
        wrong_timesheet = first_half.timesheets.create!(employee: employee)
        future_shift = create(
          :shift,
          employee: employee,
          calendar_event: create(
            :calendar_event,
            starts_at: Time.zone.local(2024, 3, 20, 9, 0, 0),
            ends_at: Time.zone.local(2024, 3, 20, 17, 0, 0),
          ),
        )
        future_shift.update_column(:timesheet_id, wrong_timesheet.id) # rubocop:disable Rails/SkipsModelValidations

        first_half.reattach_out_of_range_shifts!

        expect(future_shift.reload.timesheet.pay_period.starts_at.to_date).to eq(Date.new(2024, 3, 16))
        expect(future_shift.timesheet.pay_period.ends_at.to_date).to eq(Date.new(2024, 3, 31))
      end
    end

    it "is invoked when for_period_dates shrinks a same-start period" do
      travel_to Time.zone.local(2024, 3, 10, 12, 0, 0) do
        oversized = described_class.for_period_dates(Date.new(2024, 3, 1), Date.new(2024, 3, 31))
        employee = create(:employee)
        wrong_timesheet = oversized.timesheets.create!(employee: employee)
        future_shift = create(
          :shift,
          employee: employee,
          calendar_event: create(
            :calendar_event,
            starts_at: Time.zone.local(2024, 3, 20, 9, 0, 0),
            ends_at: Time.zone.local(2024, 3, 20, 17, 0, 0),
          ),
        )
        future_shift.update_column(:timesheet_id, wrong_timesheet.id) # rubocop:disable Rails/SkipsModelValidations

        described_class.for_period_dates(Date.new(2024, 3, 1), Date.new(2024, 3, 15))

        expect(oversized.reload.ends_at.to_date).to eq(Date.new(2024, 3, 15))
        expect(future_shift.reload.timesheet.pay_period.starts_at.to_date).to eq(Date.new(2024, 3, 16))
      end
    end
  end

  describe "destroying with associated timesheets" do
    it "does not allow destroying when any associated timesheet is approved" do
      pay_period = create(:pay_period, finalized_at: nil)
      create(:timesheet, pay_period: pay_period, approved_at: Date.current)

      expect { pay_period.destroy }.not_to change(described_class, :count)
      expect(pay_period.errors[:base]).to include("cannot delete pay period with approved timesheets")
      expect(pay_period.reload.timesheets.count).to eq(1)
    end

    it "destroys unapproved timesheets when destroying the pay period" do
      pay_period = create(:pay_period, finalized_at: nil)
      create_list(:timesheet, 2, pay_period: pay_period, approved_at: nil)

      expect {
        pay_period.destroy
      }.to change(described_class, :count).by(-1).and change(Timesheet, :count).by(-2)
    end

    it "does not allow destroying a finalized pay period" do
      pay_period = create(:pay_period, finalized_at: Time.current, approved_at: nil)

      expect { pay_period.destroy }.not_to change(described_class, :count)
      expect(pay_period.errors[:base]).to include("cannot delete a finalized pay period")
    end
  end

  describe "#finalize!" do
    it "locks the period and stores a summary snapshot" do
      user = create(:user)
      pay_period = create(:pay_period, finalized_at: nil, approved_at: nil)
      create(:employee)

      pay_period.finalize!(user)

      expect(pay_period).to be_finalized
      expect(pay_period.versions.where(event: "update").last.whodunnit).to eq(user.id.to_s)
      expect(pay_period.config_snapshot).to include("finalized_summary")
    end
  end

  describe "#record_export!" do
    it "writes an export version for a finalized period" do
      user = create(:user)
      pay_period = create(:pay_period, finalized_at: Time.current, approved_at: nil)

      expect {
        pay_period.record_export!(user)
      }.to change { pay_period.versions.where(event: "export").count }.by(1)

      expect(pay_period.versions.where(event: "export").last.whodunnit).to eq(user.id.to_s)
    end
  end

  describe "#record_adjustment!" do
    it "creates an adjustment on a finalized period" do
      user = create(:user)
      pay_period = create(:pay_period, finalized_at: Time.current, approved_at: nil)

      adjustment = pay_period.record_adjustment!(
        user: user,
        reason: "Fix hours",
        change_set: { "total_ot_hours" => { "before" => 2, "after" => 0 } },
      )

      expect(adjustment).to be_persisted
      expect(adjustment.reason).to eq("Fix hours")
    end
  end
end
