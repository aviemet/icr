# frozen_string_literal: true

require "rails_helper"

RSpec.describe Reports::SyncExport do
  let(:user) do
    create(:user).tap do |record|
      record.confirm
      record.add_role(:admin)
    end
  end
  let(:client) { create(:client) }

  it "ensures the system definition and creates a completed request" do
    ReportDefinition.where(slug: "client-face-sheet").delete_all

    request = described_class.call(
      definition_slug: "client-face-sheet",
      user: user,
      params: { "client_id" => client.id },
    )

    expect(ReportDefinition.find_by(slug: "client-face-sheet")).to be_present
    expect(request.status).to eq("complete")
    expect(request.file).to be_attached
    expect(request.file.content_type).to eq("application/pdf")
    expect(request.definition_snapshot["slug"]).to eq("client-face-sheet")
    expect(request.definition_snapshot["mode"]).to eq("custom")
  end
end
