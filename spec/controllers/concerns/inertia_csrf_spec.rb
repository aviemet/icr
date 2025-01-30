require "rails_helper"
require_relative "../../support/devise"

RSpec.describe InertiaCsrf, type: :controller do
  include Devise::Test::ControllerHelpers

  controller(ApplicationController) do
    def index
      render plain: "OK"
    end
  end

  before do
    routes.draw { get "index" => "anonymous#index" }
  end

  describe "CSRF protection" do
    login_admin

    it "sets XSRF-TOKEN cookie" do
      get :index
      expect(cookies["XSRF-TOKEN"]).to be_present
    end

    it "accepts CSRF token from HTTP_X_XSRF_TOKEN header" do
      token = "test-token"
      request.headers["HTTP_X_XSRF_TOKEN"] = token
      expect(controller.request_authenticity_tokens).to include(token)
    end
  end
end
