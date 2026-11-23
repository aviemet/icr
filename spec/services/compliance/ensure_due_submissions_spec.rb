require "rails_helper"

RSpec.describe Compliance::EnsureDueSubmissions do
  let!(:template) { Compliance::HazardAssessmentSeed.ensure! }

  it "creates an initial due draft for a household without prior submissions" do
    household = create(:household)
    client = create(:client)
    create(:households_client, household: household, client: client)

    created = described_class.call(as_of: Date.current, template: template)
    submission = created.find { |row| row.household_id == household.id }

    expect(submission).to be_present
    expect(submission.client).to eq(client)
    expect(submission).to be_draft
    expect(submission).to be_started_via_initial
    expect(submission.due_on).to eq(Date.current)
  end

  it "does not duplicate an open draft" do
    household = create(:household)
    client = create(:client)
    create(:households_client, household: household, client: client)
    create(
      :compliance_form_submission,
      form_template: template,
      household: household,
      client: client,
      status: :draft,
      due_on: Date.current,
    )

    created = described_class.call(as_of: Date.current, template: template)

    expect(created.select { |row| row.household_id == household.id }).to be_empty
    expect(Compliance::FormSubmission.where(household: household).count).to eq(1)
  end

  it "creates the next quarterly draft when prior submission is past interval" do
    household = create(:household)
    client = create(:client)
    create(:households_client, household: household, client: client)
    create(
      :compliance_form_submission,
      :submitted,
      form_template: template,
      household: household,
      client: client,
      inspected_on: Date.current - 4.months,
      due_on: Date.current - 4.months,
    )

    created = described_class.call(as_of: Date.current, template: template)
    draft = created.find { |row| row.household_id == household.id }

    expect(draft).to be_present
    expect(draft).to be_started_via_quarterly
    expect(draft.due_on).to eq(Date.current - 1.month)
  end

  it "skips households that are not yet due" do
    household = create(:household)
    client = create(:client)
    create(:households_client, household: household, client: client)
    create(
      :compliance_form_submission,
      :submitted,
      form_template: template,
      household: household,
      client: client,
      inspected_on: Date.current - 1.month,
      due_on: Date.current - 1.month,
    )

    created = described_class.call(as_of: Date.current, template: template)

    expect(created.select { |row| row.household_id == household.id }).to be_empty
    expect(Compliance::FormSubmission.where(household: household).count).to eq(1)
  end
end
