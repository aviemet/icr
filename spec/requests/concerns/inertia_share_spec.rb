require "rails_helper"

RSpec.describe "InertiaShare Concerns", type: :request do
  describe "shared data provided via Inertia", inertia: true do
    login_admin

    it "includes auth data (from InertiaShare::Auth)" do
      get root_path
      expect(response).to be_successful

      expect_inertia.to include_props(
        auth: a_hash_including(
          user: a_hash_including(
            email: @admin.email,
          ),
        ),
      )
    end

    it "includes menu data (from InertiaShare::Menu)" do
      get root_path
      expect(response).to be_successful

      expect_inertia.to include_props(menu: {})
    end

    it "includes permissions (from InertiaShare::Permissions)" do
      get root_path
      expect(response).to be_successful

      expect_inertia.to include_props(permissions: an_instance_of(Hash))
    end

    it "includes settings (from InertiaShare::Settings)" do
      allow(Setting).to receive(:render).and_return({ theme: "dark", language: "en" })

      get root_path
      expect(response).to be_successful

      expect_inertia.to include_props(settings: { theme: "dark", language: "en" })
    end
  end

  describe "shared data when unauthenticated", inertia: true do
    it "leaves menu nil (InertiaShare::Menu else branch)" do
      allow_any_instance_of(ApplicationController).to receive(:authenticate_user!)

      get root_path

      expect(response).to be_successful
      expect_inertia.to include_props(
        menu: nil,
        dashboard: a_hash_including(
          active_client_count: 0,
          inactive_client_count: 0,
          active_team_count: 0,
          hiring_pipeline_count: 0,
          week_tracked_hours: 0.0,
          pending_timesheet_count: 0,
          upcoming_events: [],
          activity_items: [],
        ),
      )
    end
  end
end
