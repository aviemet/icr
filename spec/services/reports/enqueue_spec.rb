# frozen_string_literal: true

require "rails_helper"

RSpec.describe Reports::Enqueue do
  include ActiveJob::TestHelper

  let(:user) do
    create(:user).tap do |record|
      record.confirm
      record.add_role(:admin)
    end
  end
  let(:definition) { create(:report_definition) }

  it "creates a request with a definition snapshot and enqueues generation" do
    ActiveJob::Base.queue_adapter = :test

    request = described_class.call(
      definition: definition,
      user: user,
      params: { "within_days" => 14 },
    )

    expect(request).to be_persisted
    expect(request.status).to eq("pending")
    expect(request.params["within_days"]).to eq(14)
    expect(request.definition_snapshot["slug"]).to eq(definition.slug)
    expect(request.definition_snapshot["columns"]).to eq(definition.columns)
    expect(Reports::GenerateJob).to have_been_enqueued.with(request.id)
  end
end
