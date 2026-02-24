require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Api::Users", type: :request do
  login_user(:admin)

  describe "PATCH /update" do
    it "is successful with valid parameters" do
      user = create(:user)
      patch api_user_url(user), params: { user: { time_zone: "Europe/London" } }
      expect(response).to have_http_status(:ok)
      expect(user.reload.time_zone).to eq("Europe/London")
    end

    it "is unsuccessful with invalid parameters" do
      user = create(:user)
      patch api_user_url(user), params: { user: { email: "" } }
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
