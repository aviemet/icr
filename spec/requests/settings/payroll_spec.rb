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

  describe "PATCH /settings/payroll/overtime" do
    before do
      Setting.overtime_daily_hours = 8
      Setting.overtime_daily_double_time_hours = 12
      Setting.overtime_seventh_day_double_time_hours = 8
    end

    it "updates overtime thresholds" do
      patch settings_payroll_overtime_url, params: {
        settings: {
          overtime_daily_hours: 9,
          overtime_daily_double_time_hours: 13,
          overtime_seventh_day_double_time_hours: 7,
        },
      }

      expect(response).to redirect_to(settings_payroll_overtime_path)
      expect(Setting.overtime_daily_hours).to eq(9)
      expect(Setting.overtime_daily_double_time_hours).to eq(13)
      expect(Setting.overtime_seventh_day_double_time_hours).to eq(7)
    end

    it "rejects a double-time threshold below the daily overtime threshold" do
      patch settings_payroll_overtime_url, params: {
        settings: { overtime_daily_hours: 10, overtime_daily_double_time_hours: 9 },
      }

      expect(response).to redirect_to(settings_payroll_overtime_path)
      expect(flash[:alert][:message]).to eq(I18n.t("settings.errors.double_time_below_daily_overtime"))
      expect(Setting.overtime_daily_hours).to eq(8)
      expect(Setting.overtime_daily_double_time_hours).to eq(12)
    end

    it "rejects out-of-range thresholds without saving any of them" do
      patch settings_payroll_overtime_url, params: {
        settings: { overtime_daily_hours: 9, overtime_seventh_day_double_time_hours: 30 },
      }

      expect(response).to redirect_to(settings_payroll_overtime_path)
      expect(flash[:alert][:message]).to eq(I18n.t("settings.errors.update_failed"))
      expect(Setting.overtime_daily_hours).to eq(8)
      expect(Setting.overtime_seventh_day_double_time_hours).to eq(8)
    end
  end

  describe "GET /settings/payroll/ihss" do
    it "renders a successful response" do
      get settings_payroll_ihss_url
      expect(response).to be_successful
      expect_inertia.to render_component "Settings/Payroll/Ihss"
    end
  end

  describe "PATCH /settings/payroll/ihss" do
    it "updates IHSS co-employer and assignment mode" do
      patch settings_payroll_ihss_url, params: {
        settings: {
          ihss_co_employer: true,
          ihss_assignment_mode: "period",
        },
      }

      expect(response).to redirect_to(settings_payroll_ihss_path)
      expect(Setting.ihss_co_employer).to be(true)
      expect(Setting.ihss_assignment_mode).to eq("period")
    end
  end
end
