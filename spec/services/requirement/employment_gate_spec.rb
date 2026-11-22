# frozen_string_literal: true

require "rails_helper"

RSpec.describe Requirement::EmploymentGate do
  let(:job_title) { create(:job_title) }
  let(:employee) do
    record = create(:employee, :employed)
    record.assign_job_title(job_title)
    record
  end

  it "allows when employment requirements are met" do
    requirement = create(:requirement, :employment, :for_job_title, scope: job_title, name: "Driver License")
    create(:requirement_item, :credential, requirement: requirement, credential_type: :drivers_license)
    create(:employee_credential, employee: employee, credential_type: :drivers_license, expires_on: 1.year.from_now)

    result = described_class.call(employee)

    expect(result).to be_allowed
    expect(result.unmet).to be_empty
  end

  it "blocks when employment requirements are unmet" do
    requirement = create(:requirement, :employment, :for_job_title, scope: job_title, name: "Driver License")
    create(:requirement_item, :credential, requirement: requirement, credential_type: :drivers_license)

    result = described_class.call(employee)

    expect(result).not_to be_allowed
    expect(result.unmet_names).to eq(["Driver License"])
  end

  it "ignores advisory and client_schedule requirements" do
    create(:requirement, name: "Advisory First Aid", enforcement: :advisory)
    client = create(:client)
    client_req = create(:requirement, :for_client, scope: client, name: "Client Training")
    training = create(:training)
    create(:requirement_item, requirement: client_req, fulfillable: training)

    result = described_class.call(employee)

    expect(result).to be_allowed
  end
end
