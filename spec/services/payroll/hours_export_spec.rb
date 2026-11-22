require "rails_helper"

RSpec.describe Payroll::HoursExport do
  describe ".call" do
    it "exports approved employee hours as vendor-neutral CSV" do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
      Setting.payroll_period_day = "monday"

      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 11), Date.new(2024, 3, 17))
        approved_employee = create(:employee, number: "E-100")
        pending_employee = create(:employee, number: "E-200")
        approved_timesheet = create(:timesheet, pay_period: pay_period, employee: approved_employee, approved_at: nil)
        create(:timesheet, pay_period: pay_period, employee: pending_employee, approved_at: nil)
        event = create(
          :calendar_event,
          starts_at: Time.zone.local(2024, 3, 12, 9, 0, 0),
          ends_at: Time.zone.local(2024, 3, 12, 17, 0, 0),
        )
        create(
          :shift,
          employee: approved_employee,
          timesheet: approved_timesheet,
          calendar_event: event,
        )
        approved_timesheet.update!(approved_at: Date.new(2024, 3, 18))
        pay_period.update!(finalized_at: Date.new(2024, 3, 19))

        csv = described_class.call(pay_period)
        rows = CSV.parse(csv, headers: true)

        expect(rows.headers).to eq(described_class::HEADERS)
        expect(rows.length).to eq(1)
        expect(rows.first["employee_number"]).to eq("E-100")
        expect(rows.first["employee_name"]).to eq(approved_employee.full_name)
        expect(rows.first["period_starts_on"]).to eq("2024-03-11")
        expect(rows.first["period_ends_on"]).to eq("2024-03-17")
        expect(rows.first["regular_hours"].to_f).to eq(8.0)
        expect(rows.first["overtime_hours"].to_f).to eq(0.0)
        expect(rows.first["total_hours"].to_f).to eq(8.0)
        expect(rows.first["approved_at"]).to be_present
        expect(rows.first["timesheet_id"]).to be_present
      end
    end
  end
end
