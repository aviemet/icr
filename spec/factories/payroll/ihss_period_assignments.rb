# frozen_string_literal: true

FactoryBot.define do
  factory :ihss_period_assignment, class: "Payroll::IhssPeriodAssignment" do
    pay_period
    employee
    client
    hours { 8.0 }
  end
end
