require "rails_helper"

RSpec.describe Payroll::EmployeeQueue do
  describe ".call" do
    it "builds timesheet and exception maps for the employee page" do
      pay_period = create(:pay_period)
      employee = create(:employee)
      timesheet = create(
        :timesheet,
        pay_period: pay_period,
        employee: employee,
        approved_at: Date.current,
      )

      result = described_class.call(
        period: pay_period,
        employees: Employee.where(id: employee.id),
        total_count: 1,
        pagination: { pages: 1, current_page: 1 },
        exception_counts: { employee.id.to_s => { exception_count: 2 } },
      )

      expect(result[:timesheet_ids_by_employee][employee.id.to_s]).to eq(timesheet.id)
      expect(result[:approved_at_by_employee]).to have_key(employee.id.to_s)
      expect(result[:employee_exceptions][employee.id.to_s][:exception_count]).to eq(2)
      expect(result[:employee_hours]).to be_a(Hash)
      expect(result[:pagination][:count]).to eq(1)
      expect(result[:pagination][:pages]).to eq(1)
    end

    it "keys hours to the same employees rendered on the page" do
      pay_period = create(
        :pay_period,
        starts_at: Time.zone.local(2024, 3, 11).beginning_of_day,
        ends_at: Time.zone.local(2024, 3, 24).end_of_day,
      )
      employees = Array.new(3) { create(:employee) }
      employees.each_with_index do |employee, index|
        timesheet = create(:timesheet, pay_period: pay_period, employee: employee, approved_at: nil)
        event = create(
          :calendar_event,
          starts_at: Time.zone.local(2024, 3, 12 + index, 9, 0, 0),
          ends_at: Time.zone.local(2024, 3, 12 + index, 17, 0, 0),
        )
        create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)
      end

      result = described_class.call(
        period: pay_period,
        employees: Employee.where(id: employees.map(&:id)).order("employees.id"),
        total_count: employees.size,
        pagination: { pages: 1, current_page: 1 },
      )

      rendered_ids = result[:employees].map { |employee| employee[:id].to_s }
      expect(result[:timesheet_ids_by_employee].keys).to match_array(rendered_ids)
      expect(result[:employee_hours].keys - rendered_ids).to eq([])
      expect(rendered_ids - result[:timesheet_ids_by_employee].keys).to eq([])
    end
  end
end
