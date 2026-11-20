require "rails_helper"

RSpec.describe Caseloads::IndexQuery do
  let!(:facilitator_title) { Employee::JobTitle.find_by!(slug: "facilitator") }
  let!(:other_title) { Employee::JobTitle.find_by!(slug: "attendant") }

  let!(:facilitator) do
    create(:employee, :employed).tap do |employee|
      employee.assign_job_title(facilitator_title)
      employee.reload
    end
  end

  let!(:non_facilitator) do
    create(:employee, :employed).tap do |employee|
      employee.assign_job_title(other_title)
      employee.reload
    end
  end

  let!(:assigned_client) { create(:client) }
  let!(:unassigned_client) { create(:client) }
  let!(:inactive_client) { create(:client, inactive_at: 1.day.ago) }
  let!(:non_facilitator_managed_client) { create(:client) }

  let!(:assignment) do
    create(:clients_manager, manager: facilitator, client: assigned_client, starts_at: 1.day.ago)
  end

  before do
    create(:clients_manager, manager: non_facilitator, client: non_facilitator_managed_client, starts_at: 1.day.ago)
  end

  it "returns facilitators, assignments, and unassigned active clients" do
    result = described_class.call

    expect(result.facilitators.map(&:id)).to eq([facilitator.id])
    expect(result.assignments.map(&:id)).to eq([assignment.id])
    expect(result.clients.map(&:id)).to eq([assigned_client.id])
    expect(result.unassigned_clients.map(&:id)).to include(unassigned_client.id, non_facilitator_managed_client.id)
    expect(result.unassigned_clients.map(&:id)).not_to include(assigned_client.id, inactive_client.id)
    expect(result.client_ids_by_facilitator[facilitator.id.to_s]).to eq([assigned_client.id])
    expect(result.caseload_counts[facilitator.id.to_s]).to eq(1)
    expect(result.facilitator_count).to eq(1)
    expect(result.clients_on_caseload_count).to eq(1)
    expect(result.unassigned_count).to eq(result.unassigned_clients.size)
  end

  it "keeps assigned and unassigned client ids disjoint for facilitator-managed set" do
    result = described_class.call
    assigned_ids = result.clients.map(&:id)
    unassigned_ids = result.unassigned_clients.map(&:id)

    expect(assigned_ids & unassigned_ids).to be_empty
  end
end
