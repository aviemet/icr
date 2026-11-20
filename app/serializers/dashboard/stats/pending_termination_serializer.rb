# frozen_string_literal: true

class Dashboard::Stats::PendingTerminationSerializer < BaseSerializer
  attributes(
    id: { type: :string },
    slug: { type: :string },
    name: { type: :string },
  )

  type :Date
  def inactive_at
    value = @object.inactive_at
    return value if value.is_a?(Time) || value.is_a?(Date) || value.is_a?(ActiveSupport::TimeWithZone)

    Time.zone.parse(value.to_s)
  end
end
