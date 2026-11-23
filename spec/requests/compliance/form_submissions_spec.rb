require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "/compliance/form_submissions", type: :request do
  login_user(:admin)

  let!(:template) { Compliance::HazardAssessmentSeed.ensure! }
  let!(:household) { create(:household) }
  let!(:client) { create(:client) }

  before do
    Flipper.enable(:compliance_forms)
    create(:households_client, household: household, client: client)
  end

  describe "when the feature flag is disabled" do
    before { Flipper.disable(:compliance_forms) }

    it "returns not found" do
      get compliance_form_submissions_url
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "GET /index" do
    it "renders queue rows and ensures due submissions for the same households" do
      get compliance_form_submissions_url

      expect(response).to be_successful
      rows = inertia.props[:form_submissions]
      expect(rows.pluck(:household_id)).to include(household.id)
      expect(rows.pluck(:form_template_id).uniq).to eq([template.id])
      expect(inertia.props[:counts][:due]).to be >= 1
    end
  end

  describe "submission lifecycle" do
    let!(:submission) do
      create(
        :compliance_form_submission,
        form_template: template,
        household: household,
        client: client,
        status: :draft,
        due_on: Date.current,
      )
    end

    it "updates answers and submits" do
      item = template.form_sections.first.form_items.first

      put compliance_form_submission_url(submission), params: {
        form_submission: {
          inspected_on: Date.current,
          form_answers_attributes: [
            { form_item_id: item.id, check_value: "fail" },
          ],
        },
      }

      expect(response).to redirect_to(compliance_form_submission_url(submission))
      submission.reload
      expect(submission.form_answers.find_by(form_item_id: item.id).check_value).to eq("fail")

      post submit_compliance_form_submission_url(submission)
      expect(submission.reload).to be_submitted
    end

    it "creates and closes corrective actions with optional incident link" do
      incident = create(:incident_report, client: client)

      post compliance_form_submission_corrective_actions_url(submission), params: {
        corrective_action: {
          description: "Blocked exit",
          root_cause: "Clutter",
          remedy: "Cleared hallway",
          incident_report_id: incident.id,
        },
      }

      action = submission.corrective_actions.last
      expect(action.description).to eq("Blocked exit")
      expect(action.incident_report).to eq(incident)

      post close_compliance_form_submission_corrective_action_url(submission, action)
      expect(action.reload).not_to be_open
    end
  end
end
