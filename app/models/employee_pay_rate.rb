# == Schema Information
#
# Table name: employee_pay_rates
#
#  id            :bigint           not null, primary key
#  ends_at       :date
#  starts_at     :date
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  employee_id   :bigint           not null
#  pay_rate_id   :bigint           not null
#  shift_type_id :bigint           not null
#
# Indexes
#
#  index_employee_pay_rates_on_employee_id    (employee_id)
#  index_employee_pay_rates_on_pay_rate_id    (pay_rate_id)
#  index_employee_pay_rates_on_shift_type_id  (shift_type_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (pay_rate_id => pay_rates.id)
#  fk_rails_...  (shift_type_id => shift_types.id)
#
class EmployeePayRate < ApplicationRecord

  pg_search_scope(
    :search,
    against: [:employee, :pay_rate, :shift_type],
    associated_against: {
      employee: [],
      pay_rate: [],
      shift_type: [],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  belongs_to :employee
  belongs_to :pay_rate
  belongs_to :shift_type

  scope :includes_associated, -> { includes([:employee, :pay_rate, :shift_type]) }
end
