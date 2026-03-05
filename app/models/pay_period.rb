# == Schema Information
#
# Table name: pay_periods
#
#  id              :uuid             not null, primary key
#  approved_at     :datetime
#  config_snapshot :jsonb
#  ends_at         :datetime
#  period_type     :integer
#  starts_at       :datetime
#  status          :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
class PayPeriod < ApplicationRecord
  include PgSearchable

  pg_search_config(against: [:starts_at, :ends_at, :status, :approved_at, :period_type, :config_snapshot])

  tracked
  resourcify

  has_many :timesheets, dependent: :nullify

  scope :includes_associated, -> { includes([]) }
end
