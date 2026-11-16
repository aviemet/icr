require "rails_helper"
require_relative "../support/devise"

RSpec.describe "Payrolls", type: :request do
  login_user(:admin)

  describe "GET /settings/payroll/schedule" do
    it "renders a successful response" do
      get settings_payroll_schedule_url
      expect(response).to be_successful
    end
  end
end
