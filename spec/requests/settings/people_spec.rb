require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Settings::People", type: :request do
  login_user(:admin)

  describe "GET /index" do
    it "renders a successful response" do
      get settings_people_url
      expect(response).to be_successful
    end
  end
end
