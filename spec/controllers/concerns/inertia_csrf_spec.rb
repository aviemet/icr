require "rails_helper"

RSpec.describe InertiaCsrf, type: :controller do
  controller(ApplicationController) do
    def index
      render plain: "OK"
    end
  end

  before do
    routes.draw { get "index" => "anonymous#index" }
  end

  describe "CSRF protection" do
    it "sets XSRF-TOKEN cookie" do
      user = create(:user)
      sign_in user

      get :index
      expect(cookies["XSRF-TOKEN"]).to be_present
    end

    it "accepts CSRF token from HTTP_X_XSRF_TOKEN header" do
      user = create(:user)
      sign_in user

      token = "test-token"
      request.headers["HTTP_X_XSRF_TOKEN"] = token
      expect(controller.request_authenticity_tokens).to include(token)
    end
  end
end
