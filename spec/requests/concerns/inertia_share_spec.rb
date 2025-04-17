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
end
