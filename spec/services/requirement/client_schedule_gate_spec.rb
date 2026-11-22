# frozen_string_literal: true

require "rails_helper"

RSpec.describe Requirement::ClientScheduleGate do
  let(:employee) { create(:employee, :employed) }
  let(:client) { create(:client) }
  let(:training) { create(:training, name: "Client Protocol") }

  it "allows when client schedule requirements are met" do
    requirement = create(:requirement, :for_client, scope: client, name: "Protocol")
    create(:requirement_item, requirement: requirement, fulfillable: training)
    create(:employees_training, :completed, employee: employee, training: training)

    result = described_class.call(employee: employee, client: client)

    expect(result).to be_allowed
  end

  it "blocks when client schedule requirements are unmet" do
    requirement = create(:requirement, :for_client, scope: client, name: "Protocol")
    create(:requirement_item, requirement: requirement, fulfillable: training)

    result = described_class.call(employee: employee, client: client)

    expect(result).not_to be_allowed
    expect(result.unmet_names).to eq(["Protocol"])
  end

  it "ignores requirements for other clients" do
    other_client = create(:client)
    requirement = create(:requirement, :for_client, scope: other_client, name: "Other Protocol")
    create(:requirement_item, requirement: requirement, fulfillable: training)

    result = described_class.call(employee: employee, client: client)

    expect(result).to be_allowed
  end
end
