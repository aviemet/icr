require "rails_helper"

RSpec.describe Employee::JobTitle::PermissionsReader do
  let(:job_title) { create(:job_title) }

  it "returns empty permissions when no roles are assigned" do
    permissions = described_class.call(job_title)

    expect(permissions["admin"]).to be false
    expect(permissions["client"]["index"]).to be false
    expect(permissions["client"]["delete"]).to be false
  end

  it "maps destroy roles to delete in the form hash" do
    job_title.add_role(:destroy, Client)

    permissions = described_class.call(job_title)

    expect(permissions["client"]["delete"]).to be true
  end

  it "marks admin true when every action is granted" do
    Employee::JobTitle::PermissionsCatalog::RESOURCES.each_value do |resource_class|
      Employee::JobTitle::PermissionsCatalog::ACTIONS.each do |action|
        job_title.add_role(action.to_sym, resource_class)
      end
    end

    permissions = described_class.call(job_title)

    expect(permissions["admin"]).to be true
  end
end
