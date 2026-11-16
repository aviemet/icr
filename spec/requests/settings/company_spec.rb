require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Settings::Companies", type: :request do
  login_user(:admin)

  describe "GET /show" do
    it "renders a successful response" do
      get settings_company_url

      expect(response).to be_successful
      expect_inertia.to render_component "Settings/Company/Details"
    end
  end

  describe "PATCH /update" do
    it "updates the company name" do
      company = Company.instance

      patch settings_company_url, params: {
        company: { name: "Updated Agency" }
      }

      expect(response).to redirect_to(settings_company_path)
      expect(company.reload.name).to eq("Updated Agency")
      expect(Setting.company_name).to eq("Updated Agency")
    end
  end
end
