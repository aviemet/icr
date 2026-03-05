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
