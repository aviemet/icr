# frozen_string_literal: true

require "rails_helper"

RSpec.describe Payroll::ClientPeriodIhssHours do
  it "sums IHSS-classified hours for clients in the period" do
    Setting.ihss_assignment_mode = "shift"
    Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
    Setting.payroll_period_day = "monday"
    employee = create(:employee)
    client = create(:client)
    pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 11), Date.new(2024, 3, 17))
    timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
    event = create(
      :calendar_event,
      starts_at: Time.zone.local(2024, 3, 12, 9, 0, 0),
      ends_at: Time.zone.local(2024, 3, 12, 17, 0, 0),
    )
    event.event_participants.create!(participant: client)
    shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event, ihss: true)
    shift.update!(ihss: true)

    result = described_class.call(pay_period: pay_period, client_ids: [client.id])

    expect(result[client.id.to_s]).to eq(8.0)
  end
end

