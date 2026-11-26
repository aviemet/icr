# frozen_string_literal: true

require "rails_helper"

RSpec.describe Payroll::EmployeeQueue do
  before do
    Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
    Setting.payroll_period_day = "monday"
  end

  def pay_period_for(date)
    period_start, period_end = Payroll::Period.period_dates(date)
    PayPeriod.for_period_dates(period_start, period_end)
  end

  it "keeps employee_hours keys lockstep with rendered employee ids including leave totals" do
    pay_period = pay_period_for(Date.new(2024, 3, 15))
    employee = create(:employee, :employed)
    timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
    vacation = ServiceType.find_or_create_by!(slug: "vacation") do |service_type|
      service_type.name = "Vacation"
      service_type.system = true
      service_type.billable = false
      service_type.payable = true
      service_type.color = "#B45309"
      service_type.position = 0
    end
    event = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0), ends_at: Time.zone.local(2024, 3, 15, 17, 0, 0))
    create(:shift, employee: employee, timesheet: timesheet, calendar_event: event, service_type: vacation)

    employees = Employee.where(id: employee.id)
    queue = described_class.call(
      period: pay_period,
      employees: employees,
      total_count: 1,
      pagination: { page: 1, pages: 1 },
    )

    employee_ids = queue[:employees].map { |row| row[:id].to_s }
    expect(queue[:employee_hours].keys).to match_array(employee_ids)
    expect(queue[:employee_hours][employee.id.to_s][:pto_hours]).to eq(8.0)
    expect(queue[:timesheet_ids_by_employee].keys).to match_array(employee_ids)
  end
end
