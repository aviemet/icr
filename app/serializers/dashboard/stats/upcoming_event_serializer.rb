# frozen_string_literal: true

class Dashboard::Stats::UpcomingEventSerializer < BaseSerializer
  attributes(
    id: { type: :string },
    name: { type: :string },
    starts_at: { type: :string },
    ends_at: { type: :string },
  )
end
