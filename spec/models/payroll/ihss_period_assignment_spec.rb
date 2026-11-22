# frozen_string_literal: true

require "rails_helper"

# == Schema Information
#
# Table name: ihss_period_assignments
#
#  id            :uuid             not null, primary key
#  hours         :decimal(8, 2)    not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  client_id     :uuid             not null
#  employee_id   :uuid             not null
#  pay_period_id :uuid             not null
#
# Indexes
#
#  index_ihss_period_assignments_on_client_id      (client_id)
#  index_ihss_period_assignments_on_employee_id    (employee_id)
#  index_ihss_period_assignments_on_pay_period_id  (pay_period_id)
#  index_ihss_period_assignments_uniqueness        (pay_period_id,employee_id,client_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (pay_period_id => pay_periods.id)
#
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
