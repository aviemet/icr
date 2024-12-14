# == Schema Information
#
# Table name: pay_rates
#
#  id            :uuid             not null, primary key
#  notes         :text
#  period        :integer          not null
#  rate_cents    :integer          default(0), not null
#  rate_currency :string           default("USD"), not null
#  title         :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
class PayRate < ApplicationRecord

  pg_search_scope(
    :search,
    against: [:employee, :rate, :period, :starts_at, :ends_at, :title, :notes],
    associated_against: {
      employee: [],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  monetize :rate_cents

  enum :period, { hourly: 0, salary: 1 }

  belongs_to :employee

  scope :active, -> { where("ends_at IS NULL OR ends_at >= ?", Time.current) }

  scope :historical, -> { where.not(ends_at: nil).where(ends_at: ...Time.current) }

  scope :includes_associated, -> { includes([:employee]) }
end
