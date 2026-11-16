require "rails_helper"

RSpec.describe "Devise pages", type: :request do
  describe "GET /login" do
    it "renders a successful response" do
      get new_user_session_url

      expect(response).to be_successful
      expect_inertia.to render_component "Devise/Login"
    end
  end

  describe "GET /users/register" do
    it "renders a successful response" do
      get new_user_registration_url

      expect(response).to be_successful
      expect_inertia.to render_component "Devise/Register"
    end
  end

  describe "GET /users/password/new" do
    it "renders a successful response" do
      get new_user_password_url

      expect(response).to be_successful
      expect_inertia.to render_component "Devise/Passwords/New"
    end
  end

  describe "GET /users/confirmation/new" do
    it "renders a successful response" do
      get new_user_confirmation_url

      expect(response).to be_successful
      expect_inertia.to render_component "Devise/Confirmations/New"
    end
  end
end
