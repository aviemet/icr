require "rails_helper"

RSpec.describe CustomFailure, type: :request do
  describe "request integration" do
    it "redirects to login for unauthenticated HTML request to protected path" do
      get settings_general_path, headers: { "Accept" => "text/html" }
      expect(response).to redirect_to(new_user_session_path)
      expect(response.status).to eq(302)
    end

    it "sets x-inertia and redirects for unauthenticated JSON request" do
      get settings_general_path, headers: { "Accept" => "application/json" }
      expect(response.headers["x-inertia"]).to eq(true)
      expect(response).to redirect_to(new_user_session_path)
    end

    it "redirects with invalid credentials message when posting bad password as JSON" do
      post user_session_path, params: { user: { email: "nobody@example.com", password: "wrong" } }, headers: { "Accept" => "application/json" }
      expect(response).to redirect_to(new_user_session_path)
    end

    it "redirects to confirmation when message is unconfirmed" do
      password = "Password1!"
      user = create(:user, confirmed_at: nil, password: password)
      post user_session_path, params: { user: { email: user.email, password: password } }, headers: { "Accept" => "application/json" }
      expect(response).to have_http_status(:redirect)
      expect(response.location).to include(new_user_confirmation_path)
    end
  end
end
