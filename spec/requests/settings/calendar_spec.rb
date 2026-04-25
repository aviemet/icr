require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Settings::Calendars", type: :request do
  login_user(:admin)

  describe "GET /show" do
    it "renders a successful response" do
      get settings_calendar_url
      expect(response).to be_successful
    end
  end
end
