require "rails_helper"

RSpec.describe "InertiaShare", type: :request do
  describe "shared data" do
    it "includes auth data" do
      user = create(:user)
      sign_in user

      get root_path

      expect(response).to be_successful
      shared_data = response.headers["X-Inertia-Share"]
      parsed_data = JSON.parse(shared_data)
      expect(parsed_data["auth"]["user"]).to be_present
    end

    it "includes flash messages" do
      sign_in create(:user)

      get root_path, params: {}, flash: { success: "Test message" }

      shared_data = response.headers["X-Inertia-Share"]
      parsed_data = JSON.parse(shared_data)
      expect(parsed_data["flash"]["success"]).to eq("Test message")
    end
  end
end
