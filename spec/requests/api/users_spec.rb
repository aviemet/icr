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

  describe "PATCH /update_table_preferences" do
    it "replaces hide preferences for a model" do
      user = @user
      user.update!(table_preferences: {
        "employees" => { "hide" => { "active_at" => true }, "limit" => "25" }
      })

      patch api_update_table_preferences_url(user), params: {
        user: {
          table_preferences: {
            employees: { hide: { "number" => true }, limit: "25" }
          }
        }
      }

      expect(response).to have_http_status(:ok)
      expect(user.reload.table_preferences["employees"]).to eq(
        "hide" => { "number" => true },
        "limit" => "25",
      )
    end
  end
end
