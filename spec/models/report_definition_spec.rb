# frozen_string_literal: true

require "rails_helper"

RSpec.describe ReportDefinition do
  it "rejects unknown registry columns" do
    definition = build(:report_definition, columns: %w[employee_name not_a_column])

    expect(definition).not_to be_valid
    expect(definition.errors[:columns].join).to include("not_a_column")
  end

  it "rejects unknown resource keys" do
    definition = build(:report_definition, resource_key: "not_registered")

    expect(definition).not_to be_valid
    expect(definition.errors[:resource_key].join).to include("registered")
  end

  it "builds a snapshot for enqueue isolation" do
    definition = create(:report_definition)
    snapshot = definition.snapshot

    expect(snapshot["slug"]).to eq(definition.slug)
    expect(snapshot["columns"]).to eq(definition.columns)
    expect(snapshot["resource_key"]).to eq("employee_credential")
  end
end
