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
class Employee::PayRateSerializer < ApplicationSerializer
  object_as :pay_rate, model: "Employee::PayRate"

  attributes(
    :employee_id,
    :rate_cents,
    :rate_currency,
    :period,
    :starts_at,
    :ends_at,
    :notes,
  )

  type :string, optional: false
  def rate
    @object.rate.to_s
  end
end
