# == Schema Information
#
# Table name: pay_rates
#
#  id            :uuid             not null, primary key
#  ends_at       :datetime
#  notes         :text
#  period        :integer          not null
#  rate_cents    :integer          default(0), not null
#  rate_currency :string           default("USD"), not null
#  starts_at     :datetime
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  employee_id   :uuid             not null
#
# Indexes
#
#  index_pay_rates_on_employee_id  (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#
FactoryBot.define do
  factory :pay_rate, class: "Employee::PayRate" do
    period { :hourly }
    rate { Faker::Commerce.price(range: 18..50.0) }
    period { 0 }

    trait :historical do
      starts_at { 2.years.ago }
      ends_at { 3.months.ago }
    end

    trait :active do
      starts_at { 6.months.ago }
    end

    employee
  end
end
