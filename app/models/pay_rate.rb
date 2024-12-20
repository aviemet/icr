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
class PayRate < ApplicationRecord
  pg_search_scope(
    :search,
    against: [:employee, :rate, :period, :starts_at, :ends_at, :name, :notes],
    associated_against: {
      employee: [],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  monetize :rate_cents, numericality: {
    greater_than: 0
  }

  enum :period, { hourly: 0, salary: 1 }

  belongs_to :employee

  scope :active, -> { where("ends_at IS NULL OR ends_at >= ?", Time.current) }

  scope :historical, -> { where.not(ends_at: nil).where(ends_at: ...Time.current) }

  validates :period, presence: true
  validates :rate, presence: true

  scope :includes_associated, -> { includes([:employee]) }
end
