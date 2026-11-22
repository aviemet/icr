# frozen_string_literal: true

require "rails_helper"

RSpec.describe Shift do
  describe "#invalidate_approvals!" do
    it "clears facilitator and timesheet approval when event times change" do
      pay_period = create(:pay_period, finalized_at: nil, approved_at: nil)
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee, approved_at: nil)
      event = create(
        :calendar_event,
        starts_at: pay_period.starts_at + 1.day,
        ends_at: pay_period.starts_at + 1.day + 8.hours,
      )
      shift = create(
        :shift,
        employee: employee,
        timesheet: timesheet,
        calendar_event: event,
      )
      shift.update!(facilitator_approved_at: Date.current)
      shift.timesheet.update!(approved_at: Date.current)

      event.update!(
        starts_at: event.starts_at + 30.minutes,
        ends_at: event.ends_at + 30.minutes,
      )

      expect(shift.reload.facilitator_approved_at).to be_nil
      expect(shift.timesheet.reload.approved_at).to be_nil
    end
  end

  describe "#clear_facilitator_approval!" do
    it "clears facilitator approval when attaching a shift into a period" do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]
      travel_to Time.zone.local(2024, 3, 10, 12, 0, 0) do
        employee = create(:employee)
        event = create(
          :calendar_event,
          starts_at: Time.zone.local(2024, 3, 12, 9, 0, 0),
          ends_at: Time.zone.local(2024, 3, 12, 17, 0, 0),
        )
        shift = create(:shift, employee: employee, calendar_event: event, facilitator_approved_at: Date.current)
        timesheet = shift.reload.timesheet
        timesheet.update!(approved_at: Date.current)
        shift.update!(facilitator_approved_at: Date.current)

        PayPeriod.attach_shift!(shift)

        expect(shift.reload.facilitator_approved_at).to be_nil
        expect(timesheet.reload.approved_at).to be_nil
      end
    end
  end
end
