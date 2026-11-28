# frozen_string_literal: true

require "rails_helper"

RSpec.describe Payroll::ReplaceIhssPeriodAssignments do
  it "rejects assignments that exceed a client's authorized hours" do
    pay_period = create(:pay_period, finalized_at: nil)
    employee = create(:employee)
    client = create(:client, ihss_authorized_hours: 10)

    expect {
      described_class.call(
        period: pay_period,
        rows: [
          { employee_id: employee.id, client_id: client.id, hours: 12 },
        ],
      )
    }.to raise_error(Payroll::ReplaceIhssPeriodAssignments::AuthorizationExceeded)

    expect(Payroll::IhssPeriodAssignment.where(pay_period: pay_period)).to be_empty
  end

  it "clears an assignment when hours are negative" do
    pay_period = create(:pay_period, finalized_at: nil)
    employee = create(:employee)
    client = create(:client, ihss_authorized_hours: 20)
    create(
      :ihss_period_assignment,
      pay_period: pay_period,
      employee: employee,
      client: client,
      hours: 5,
    )

    described_class.call(
      period: pay_period,
      rows: [
        { employee_id: employee.id, client_id: client.id, hours: -1 },
      ],
    )

    expect(Payroll::IhssPeriodAssignment.where(pay_period: pay_period)).to be_empty
  end
end
