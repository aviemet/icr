# frozen_string_literal: true

require "rails_helper"

RSpec.describe Reports::Runner do
  include ActiveJob::TestHelper

  let(:user) do
    create(:user).tap do |record|
      record.confirm
      record.add_role(:admin)
    end
  end
  let(:employee) { create(:employee) }
  let(:definition) { create(:report_definition) }
  let(:report_request) do
    create(
      :report_request,
      report_definition: definition,
      requested_by: user,
      definition_snapshot: definition.snapshot,
      params: { "within_days" => 30, "include_expired" => true },
    )
  end

  it "generates an xlsx file and marks the request complete" do
    create(
      :employee_credential,
      employee: employee,
      expires_on: Date.current + 10.days,
      name: "CPR",
    )

    described_class.call(report_request)

    report_request.reload
    expect(report_request.status).to eq("complete")
    expect(report_request.file).to be_attached
    expect(report_request.file.filename.to_s).to include(definition.slug)
    expect(report_request.file.content_type).to include("spreadsheetml")
  end

  it "marks the request failed when the resource is unknown" do
    report_request.update!(
      definition_snapshot: definition.snapshot.merge("resource_key" => "missing_resource"),
    )

    described_class.call(report_request)

    report_request.reload
    expect(report_request.status).to eq("failed")
    expect(report_request.error_message).to include("Unknown reportable resource")
  end

  it "runs a custom generator and attaches its content type" do
    client = create(:client)
    custom_definition = create(:report_definition, :client_face_sheet)
    custom_request = create(
      :report_request,
      report_definition: custom_definition,
      requested_by: user,
      definition_snapshot: custom_definition.snapshot,
      params: { "client_id" => client.id },
    )

    described_class.call(custom_request)

    custom_request.reload
    expect(custom_request.status).to eq("complete")
    expect(custom_request.file).to be_attached
    expect(custom_request.file.content_type).to eq("application/pdf")
  end
end
