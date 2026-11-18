require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Settings::OvertimeExemptions", type: :request do
  login_user(:admin)

  let(:valid_criteria) do
    [{
      "category" => { "operator" => "equals", "value" => "sleep_shift" },
      "duration" => { "operator" => "greater_than_equal", "value" => 8 }
    }]
  end

  describe "GET /settings/payroll/overtime" do
    it "includes overtime exemptions in props" do
      exemption = create(:overtime_exemption, name: "Sleep Shift OT", criteria: valid_criteria)

      get settings_payroll_overtime_url

      expect(response).to be_successful
      expect_inertia.to render_component "Settings/Payroll/Overtime"
      listed = inertia.props[:overtime_exemptions]
      expect(listed).to be_an(Array)
      expect(listed.first[:id]).to eq(exemption.id)
      expect(listed.first[:name]).to eq("Sleep Shift OT")
      expect(listed.first[:criteria]).to eq(valid_criteria)
    end
  end

  describe "POST /settings/overtime_exemptions" do
    it "creates an overtime exemption and redirects to payroll overtime settings" do
      expect {
        post settings_overtime_exemptions_url, params: {
          overtime_exemption: {
            name: "Overnight Sleep",
            active: true,
            criteria: valid_criteria
          }
        }, as: :json
      }.to change(OvertimeExemption, :count).by(1)

      expect(response).to redirect_to(settings_payroll_overtime_path)
      created = OvertimeExemption.order(:created_at).last
      expect(created.name).to eq("Overnight Sleep")
      expect(created.active).to be(true)
      expect(created.criteria).to eq(valid_criteria)
    end

    it "persists criteria that still match a shift" do
      post settings_overtime_exemptions_url, params: {
        overtime_exemption: {
          name: "Sleep Match",
          active: true,
          criteria: valid_criteria
        }
      }, as: :json

      exemption = OvertimeExemption.find_by!(name: "Sleep Match")
      shift = Struct.new(:category, :start_time, :end_time, :duration_hours, keyword_init: true).new(
        category: "sleep_shift",
        start_time: Time.zone.parse("2024-01-01 22:00"),
        end_time: Time.zone.parse("2024-01-02 06:00"),
        duration_hours: 8,
      )
      expect(exemption.matches?(shift)).to be(true)
    end
  end

  describe "PATCH /settings/overtime_exemptions/:id" do
    it "updates name and criteria" do
      exemption = create(:overtime_exemption, name: "Old Name", criteria: valid_criteria)
      updated_criteria = [{
        "category" => { "operator" => "equals", "value" => "standby" }
      }]

      patch settings_overtime_exemption_url(exemption), params: {
        overtime_exemption: {
          name: "Standby Exempt",
          active: true,
          criteria: updated_criteria
        }
      }, as: :json

      expect(response).to redirect_to(settings_payroll_overtime_path)
      exemption.reload
      expect(exemption.name).to eq("Standby Exempt")
      expect(exemption.criteria).to eq(updated_criteria)
    end

    it "deactivates an exemption" do
      exemption = create(:overtime_exemption, name: "Active Rule", active: true, criteria: valid_criteria)

      patch settings_overtime_exemption_url(exemption), params: {
        overtime_exemption: {
          name: exemption.name,
          active: false,
          criteria: valid_criteria
        }
      }, as: :json

      expect(response).to redirect_to(settings_payroll_overtime_path)
      expect(exemption.reload.active).to be(false)
      expect(OvertimeExemption.where(active: true)).not_to include(exemption)
    end
  end
end
