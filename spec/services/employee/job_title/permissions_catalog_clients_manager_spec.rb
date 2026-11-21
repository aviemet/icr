require "rails_helper"

RSpec.describe Employee::JobTitle::PermissionsCatalog do
  it "includes clients_manager in RESOURCES" do
    expect(described_class::RESOURCES["clients_manager"]).to eq(ClientsManager)
  end

  it "includes employee_training in RESOURCES" do
    expect(described_class::RESOURCES["employee_training"]).to eq(Employee::Training)
  end

  it "includes complete as an extra action for employee_training" do
    expect(described_class.actions_for("employee_training")).to include("complete")
    expect(described_class.actions_for("client")).not_to include("complete")
  end

  it "grants ClientsManager actions when admin sync runs" do
    job_title = create(:job_title)
    Employee::JobTitle::SyncPermissions.call(job_title, { "admin" => true })

    Employee::JobTitle::PermissionsCatalog::ACTIONS.each do |action|
      expect(job_title.has_role?(action.to_sym, ClientsManager)).to be true
    end
  end

  it "does not grant ClientsManager when Facilitator-style hash omits the key" do
    job_title = create(:job_title)
    Employee::JobTitle::SyncPermissions.call(job_title, {
      "admin" => false,
      "client" => { "index" => true, "show" => true, "create" => false, "update" => false, "delete" => false },
    })

    Employee::JobTitle::PermissionsCatalog::ACTIONS.each do |action|
      expect(job_title.has_role?(action.to_sym, ClientsManager)).to be false
    end
  end
end
