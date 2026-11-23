require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "clients compliance form submissions", type: :request do
  login_user(:admin)

  let!(:template) { Compliance::HazardAssessmentSeed.ensure! }
  let!(:client) { create(:client) }
  let!(:household) { create(:household) }

  before do
    Flipper.enable(:compliance_forms)
    create(:households_client, household: household, client: client)
  end

  it "starts an inspection for the client household and redirects to edit" do
    post client_compliance_form_submissions_url(client)

    submission = Compliance::FormSubmission.order(:created_at).last
    expect(submission.client).to eq(client)
    expect(submission.household).to eq(household)
    expect(submission.form_template).to eq(template)
    expect(response).to redirect_to(edit_compliance_form_submission_url(submission))
  end

  it "reuses an open draft instead of creating a second submission" do
    existing = create(
      :compliance_form_submission,
      form_template: template,
      household: household,
      client: client,
      status: :draft,
    )

    expect {
      post client_compliance_form_submissions_url(client)
    }.not_to change(Compliance::FormSubmission, :count)

    expect(response).to redirect_to(edit_compliance_form_submission_url(existing))
  end
end
