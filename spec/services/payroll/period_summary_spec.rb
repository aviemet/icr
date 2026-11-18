require "rails_helper"

RSpec.describe Payroll::PeriodSummary do
  describe ".call" do
    before do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
      Setting.payroll_period_day = "monday"
      Setting.payroll_due_date_rule_type = Setting::PAYROLL_DUE_DATE_RULE_TYPES[:days_after_period_end]
      Setting.payroll_due_date_days = 5
    end

    it "returns pending when the period has ended and approvals remain" do
      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        pay_period = create(
          :pay_period,
          starts_at: Date.new(2024, 3, 11).beginning_of_day,
          ends_at: Date.new(2024, 3, 17).end_of_day,
          finalized_at: nil,
          approved_at: nil,
        )
        approved_employee = create(:employee)
        pending_employee = create(:employee)
        create(:timesheet, pay_period: pay_period, employee: approved_employee, approved_at: Date.new(2024, 3, 18))
        create(:timesheet, pay_period: pay_period, employee: pending_employee, approved_at: nil)

        summary = described_class.call(pay_period, employee_ids: [approved_employee.id, pending_employee.id])

        expect(summary[:approved_count]).to eq(1)
        expect(summary[:pending_count]).to eq(1)
        expect(summary[:workflow_status]).to eq("pending")
        expect(summary[:approval_window_open]).to be(true)
      end
    end

    it "returns current while the period is in progress before the end day" do
      travel_to Time.zone.local(2024, 3, 13, 12, 0, 0) do
        pay_period = create(
          :pay_period,
          starts_at: Date.new(2024, 3, 11).beginning_of_day,
          ends_at: Date.new(2024, 3, 17).end_of_day,
          finalized_at: nil,
          approved_at: nil,
        )
        employee = create(:employee)
        create(:timesheet, pay_period: pay_period, employee: employee, approved_at: nil)

        summary = described_class.call(pay_period, employee_ids: [employee.id])

        expect(summary[:workflow_status]).to eq("current")
      end
    end

    it "returns open for a future period" do
      travel_to Time.zone.local(2024, 3, 10, 12, 0, 0) do
        pay_period = create(
          :pay_period,
          starts_at: Date.new(2024, 3, 11).beginning_of_day,
          ends_at: Date.new(2024, 3, 17).end_of_day,
          finalized_at: nil,
          approved_at: nil,
        )
        employee = create(:employee)

        summary = described_class.call(pay_period, employee_ids: [employee.id])

        expect(summary[:workflow_status]).to eq("open")
      end
    end

    it "returns approved when every timesheet is approved" do
      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        pay_period = create(
          :pay_period,
          starts_at: Date.new(2024, 3, 11).beginning_of_day,
          ends_at: Date.new(2024, 3, 17).end_of_day,
          finalized_at: nil,
          approved_at: nil,
        )
        employee = create(:employee)
        create(:timesheet, pay_period: pay_period, employee: employee, approved_at: Date.new(2024, 3, 18))

        summary = described_class.call(pay_period, employee_ids: [employee.id])

        expect(summary[:workflow_status]).to eq("approved")
      end
    end

    it "returns closed when the period is finalized" do
      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        pay_period = create(
          :pay_period,
          starts_at: Date.new(2024, 3, 11).beginning_of_day,
          ends_at: Date.new(2024, 3, 17).end_of_day,
          finalized_at: Date.new(2024, 3, 19),
          approved_at: nil,
        )
        employee = create(:employee)
        create(:timesheet, pay_period: pay_period, employee: employee, approved_at: Date.new(2024, 3, 18))

        summary = described_class.call(pay_period, employee_ids: [employee.id])

        expect(summary[:workflow_status]).to eq("closed")
        expect(summary).not_to have_key(:finalized_by_id)
        expect(summary).not_to have_key(:exported_at)
        expect(summary).not_to have_key(:exported_by_id)
      end
    end

    it "stays closed after export is recorded in versions" do
      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        user = create(:user)
        pay_period = create(
          :pay_period,
          starts_at: Date.new(2024, 3, 11).beginning_of_day,
          ends_at: Date.new(2024, 3, 17).end_of_day,
          finalized_at: Date.new(2024, 3, 19),
          approved_at: nil,
        )
        pay_period.record_export!(user)
        employee = create(:employee)
        create(:timesheet, pay_period: pay_period, employee: employee, approved_at: Date.new(2024, 3, 18))

        summary = described_class.call(pay_period, employee_ids: [employee.id])

        expect(summary[:workflow_status]).to eq("closed")
      end
    end
  end

  describe ".archive_row" do
    it "returns the archive list shape for a period" do
      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        pay_period = create(
          :pay_period,
          starts_at: Date.new(2024, 3, 11).beginning_of_day,
          ends_at: Date.new(2024, 3, 17).end_of_day,
          finalized_at: nil,
          approved_at: nil,
        )
        employee = create(:employee)
        create(:timesheet, pay_period: pay_period, employee: employee, approved_at: nil)

        row = described_class.archive_row(pay_period, employee_ids: [employee.id])

        expect(row[:id]).to eq(pay_period.id.to_s)
        expect(row[:workflow_status]).to eq("pending")
        expect(row[:pending_count]).to eq(1)
        expect(row).to include(:payroll_due_date, :overtime_hours, :flagged_count)
        expect(row).not_to have_key(:exception_counts)
      end
    end
  end

  describe "#show_counts" do
    it "returns the show summary counts" do
      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        pay_period = create(
          :pay_period,
          starts_at: Date.new(2024, 3, 11).beginning_of_day,
          ends_at: Date.new(2024, 3, 17).end_of_day,
          finalized_at: nil,
          approved_at: nil,
        )
        employee = create(:employee)
        create(:timesheet, pay_period: pay_period, employee: employee, approved_at: Date.new(2024, 3, 18))

        counts = described_class.new(pay_period, employee_ids: [employee.id]).show_counts

        expect(counts).to eq(
          total_count: 1,
          approved_count: 1,
          pending_count: 0,
          flagged_count: 0,
        )
      end
    end
  end
end

