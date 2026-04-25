# frozen_string_literal: true

class Dashboard::StatsSerializer < BaseSerializer
  attributes(
    active_client_count: { type: :integer },
    inactive_client_count: { type: :integer },
    active_team_count: { type: :integer },
    hiring_pipeline_count: { type: :integer },
    week_tracked_hours: { type: :number },
    pending_timesheet_count: { type: :integer },
  )

  has_many :upcoming_events, serializer: Dashboard::Stats::UpcomingEventSerializer
  has_many :activity_items, serializer: Dashboard::Stats::ActivityItemSerializer
end
