# frozen_string_literal: true

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
FactoryBot.define do
  factory :ihss_period_assignment, class: "Payroll::IhssPeriodAssignment" do
    pay_period
    employee
    client
    hours { 8.0 }
  end
end
