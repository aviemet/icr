require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Settings::Calendars", type: :request do
  login_user(:admin)

  describe "GET /show" do
    it "renders a successful response" do
      get settings_calendar_url
      expect(response).to be_successful
      expect_inertia.to render_component "Settings/Calendar"
    end
  end

  describe "GET /settings/calendar/service_types" do
    it "renders a successful response" do
      get settings_service_types_url
      expect(response).to be_successful
      expect_inertia.to render_component "Settings/Calendar/ServiceTypes"
    end
  end
end
