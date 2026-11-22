# frozen_string_literal: true

require "rails_helper"

RSpec.describe Payroll::IhssPeriodAssignment, type: :model do
  it "enforces uniqueness per pay period, employee, and client" do
    assignment = create(:ihss_period_assignment)

    duplicate = build(
      :ihss_period_assignment,
      pay_period: assignment.pay_period,
      employee: assignment.employee,
      client: assignment.client,
      hours: 2,
    )

    expect(duplicate).not_to be_valid
    expect(duplicate.errors[:client_id]).to be_present
  end

  it "rejects negative hours" do
    assignment = build(:ihss_period_assignment, hours: -1)

    expect(assignment).not_to be_valid
  end
end
