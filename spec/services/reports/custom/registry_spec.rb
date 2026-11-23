# frozen_string_literal: true

require "rails_helper"

RSpec.describe Reports::Custom::Registry do
  it "fetches a registered generator" do
    expect(described_class.fetch!("client_face_sheet")).to eq(Reports::Custom::ClientFaceSheet)
  end

  it "raises for an unknown generator key" do
    expect {
      described_class.fetch!("missing_generator")
    }.to raise_error(ArgumentError, /Unknown custom report generator/)
  end
end
