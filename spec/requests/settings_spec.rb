require "rails_helper"
require_relative "../support/devise"

RSpec.describe "/settings", type: :request do
  login_user(:admin)

  def valid_attributes
    { settings: { company_name: "Test Company" } }
  end

  def invalid_attributes
    { settings: { company_name: "" } }
  end

  def new_attributes
    { settings: { company_name: "Updated Company" } }
  end

  describe "GET /show" do
    it "renders a successful response" do
      get settings_general_url
      expect(response).to be_successful
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      it "updates the setting and redirects" do
        patch settings_url, params: new_attributes
        expect(response).to redirect_to(settings_path)
        expect(Setting.company_name).to eq("Updated Company")
      end
    end

    context "with invalid parameters" do
      it "redirects to settings with errors" do
        patch settings_url, params: invalid_attributes
        expect(response).to redirect_to(settings_path)
      end
    end
  end
end
