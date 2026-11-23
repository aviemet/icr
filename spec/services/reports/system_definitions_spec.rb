# frozen_string_literal: true

require "rails_helper"

RSpec.describe Reports::SystemDefinitions do
  it "creates a missing system definition from code" do
    ReportDefinition.where(slug: "client-face-sheet").delete_all

    definition = described_class.ensure!("client-face-sheet")

    expect(definition).to be_persisted
    expect(definition.slug).to eq("client-face-sheet")
    expect(definition.mode).to eq("custom")
    expect(definition.resource_key).to eq("client_face_sheet")
    expect(definition.system).to be(true)
  end

  it "raises for an unknown system slug" do
    expect {
      described_class.ensure!("not-a-system-report")
    }.to raise_error(ArgumentError, /Unknown system report definition/)
  end
end
