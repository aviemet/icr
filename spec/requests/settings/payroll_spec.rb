require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Settings::Payrolls", type: :request do
  login_user(:admin)

  describe "GET /settings/payroll" do
    it "redirects to the pay schedule page" do
      get settings_payroll_url
      expect(response).to redirect_to(settings_payroll_schedule_path)
    end
  end

  describe "GET /settings/payroll/schedule" do
    it "renders a successful response" do
      get settings_payroll_schedule_url
      expect(response).to be_successful
      expect_inertia.to render_component "Settings/Payroll/Schedule"
    end
  end

  describe "GET /settings/payroll/overtime" do
    it "renders a successful response" do
      get settings_payroll_overtime_url
      expect(response).to be_successful
      expect_inertia.to render_component "Settings/Payroll/Overtime"
    end
  end
end
