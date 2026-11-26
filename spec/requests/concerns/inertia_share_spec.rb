require "rails_helper"

RSpec.describe "InertiaShare Concerns", type: :request do
  describe "shared data provided via Inertia" do
    login_admin

    it "includes auth data (from InertiaShare::Auth)" do
      get root_path
      expect(response).to be_successful

      expect(inertia.props.deep_symbolize_keys.fetch(:auth).fetch(:user).fetch(:email)).to eq(@admin.email)
    end

    it "includes menu data (from InertiaShare::Menu)" do
      get root_path
      expect(response).to be_successful

      expect_inertia.to have_props(menu: {})
    end

    it "includes permissions (from InertiaShare::Permissions)" do
      get root_path
      expect(response).to be_successful

      expect(inertia.props.deep_symbolize_keys.fetch(:permissions)).to be_a(Hash)
    end

    it "includes settings (from InertiaShare::Settings)" do
      allow(Setting).to receive(:render).and_return({ theme: "dark", language: "en" })

      get root_path
      expect(response).to be_successful

      expect_inertia.to have_props(settings: { theme: "dark", language: "en" })
    end

  end

  describe "shared data when unauthenticated" do
    it "does not compute policy permissions on login" do
      get "/login"

      expect(response).to be_successful
      expect_inertia.to have_props(permissions: {})
    end

    it "leaves menu nil (InertiaShare::Menu else branch)" do
      allow_any_instance_of(ApplicationController).to receive(:authenticate_user!) # rubocop:disable RSpec/AnyInstance
      allow_any_instance_of(PagesController).to receive(:authorize) # rubocop:disable RSpec/AnyInstance

      get root_path

      expect(response).to be_successful
      props = inertia.props.deep_symbolize_keys
      expect(props.fetch(:menu)).to be_nil
      expect(props.fetch(:dashboard)).to include(
        active_client_count: 0,
        inactive_client_count: 0,
        active_team_count: 0,
        hiring_pipeline_count: 0,
        week_tracked_hours: 0.0,
        pending_timesheet_count: 0,
        my_upcoming_shifts: [],
        open_shifts: [],
        staffing_visible: false,
        activity_items: [],
      )
    end
  end
end
