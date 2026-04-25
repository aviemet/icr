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
# Indexes
#
#  index_pay_periods_on_starts_at_and_ends_at  (starts_at,ends_at) UNIQUE
#
class PayPeriodSerializer < ApplicationSerializer
  include Persisted

  object_as :pay_period

  attributes(
    :starts_at,
    :ends_at,
    :status,
    :approved_at,
    :period_type,
    :config_snapshot,
  )
end
