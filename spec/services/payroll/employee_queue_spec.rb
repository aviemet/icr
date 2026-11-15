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

  end
end
