require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Settings::Notifications", type: :request do
  login_user(:admin)

  describe "GET /settings/notifications" do
    it "renders a successful response" do
      get settings_notifications_url
      expect(response).to be_successful
      expect_inertia.to render_component "Settings/Notifications"
    end
  end

  describe "PATCH /settings/notifications" do
    it "updates the payroll approval reminders toggle" do
      Setting.notifications_payroll_approval_reminders = true

      patch settings_notifications_url, params: {
        settings: { notifications_payroll_approval_reminders: false },
      }

      expect(response).to redirect_to(settings_notifications_path)
      expect(Setting.notifications_payroll_approval_reminders).to be(false)
    end
  end
end
