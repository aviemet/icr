# frozen_string_literal: true

class Dashboard::StatsSerializer < BaseSerializer
  attributes(
    active_client_count: { type: :integer },
    inactive_client_count: { type: :integer },
    active_team_count: { type: :integer },
    hiring_pipeline_count: { type: :integer },
    week_tracked_hours: { type: :number },
    pending_timesheet_count: { type: :integer },
    open_shift_count: { type: :integer },
    staffing_visible: { type: :boolean },
  )

  has_many :open_shifts, serializer: Dashboard::Stats::OpenShiftSerializer
  has_many :my_upcoming_shifts, serializer: Dashboard::Stats::MyUpcomingShiftSerializer
  has_many :activity_items, serializer: Dashboard::Stats::ActivityItemSerializer
  has_many :pending_terminations, serializer: Dashboard::Stats::PendingTerminationSerializer
end
