# frozen_string_literal: true

require "rails_helper"
require_relative "../support/devise"

RSpec.describe "Pages", :inertia do
  describe "GET /" do
    login_user(:admin)

    it "renders the Dashboard with dashboard props" do
      get root_url
      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Dashboard"
      expect(inertia.props[:dashboard]).to match(
        hash_including(
          active_client_count: kind_of(Integer),
          inactive_client_count: kind_of(Integer),
          active_team_count: kind_of(Integer),
          hiring_pipeline_count: kind_of(Integer),
          upcoming_events: kind_of(Array),
          activity_items: kind_of(Array),
          week_tracked_hours: kind_of(Numeric),
          pending_timesheet_count: kind_of(Integer),
        ),
      )
    end
  end
end
