# frozen_string_literal: true

class Dashboard::Stats::OpenShiftSerializer < BaseSerializer
  attributes(
    id: { type: :string },
    client_name: { type: :string },
    client_slug: { type: :string },
    starts_at: { type: :string },
    ends_at: { type: :string },
  )
end
