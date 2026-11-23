# frozen_string_literal: true

require "rails_helper"

# == Schema Information
#
# Table name: report_definitions
#
#  id              :uuid             not null, primary key
#  aggregator_keys :jsonb            not null
#  columns         :jsonb            not null
#  default_filters :jsonb            not null
#  format          :string           default("xlsx"), not null
#  grouper_keys    :jsonb            not null
#  mode            :string           default("list"), not null
#  name            :string           not null
#  resource_key    :string           not null
#  slug            :string           not null
#  system          :boolean          default(FALSE), not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  created_by_id   :uuid
#
# Indexes
#
#  index_report_definitions_on_created_by_id  (created_by_id)
#  index_report_definitions_on_resource_key   (resource_key)
#  index_report_definitions_on_slug           (slug) UNIQUE
#  index_report_definitions_on_system         (system)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id)
#
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

  it "accepts a registered custom generator with empty columns" do
    definition = build(:report_definition, :client_face_sheet)

    expect(definition).to be_valid
  end

  it "rejects an unknown custom generator key" do
    definition = build(
      :report_definition,
      :client_face_sheet,
      resource_key: "not_a_custom_generator",
    )

    expect(definition).not_to be_valid
    expect(definition.errors[:resource_key].join).to include("custom report generator")
  end

  it "excludes custom definitions from the catalog scope" do
    list_definition = create(:report_definition)
    custom_definition = create(:report_definition, :client_face_sheet)

    expect(described_class.catalog).to include(list_definition)
    expect(described_class.catalog).not_to include(custom_definition)
  end
end
