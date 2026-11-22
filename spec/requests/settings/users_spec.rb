require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Settings::Users", type: :request do
  login_user(:admin)

  describe "GET /settings/user" do
    it "renders a successful response" do
      get settings_user_url
      expect(response).to be_successful
      expect_inertia.to render_component "Settings/User"
    end
  end
end
