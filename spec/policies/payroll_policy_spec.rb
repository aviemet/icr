require "rails_helper"

RSpec.describe PayrollPolicy, type: :policy do
  let(:admin_user) { stub_admin_user }
  let(:employee_user) { stub_employee_user }
  let(:client_user) { stub_client_user }
  let(:record) { Timesheet.new }

  permissions :index? do
    it "allows admin" do
      expect(described_class.new(admin_user, record)).to authorize(:index)
    end

    it "allows employee with timesheet index permission" do
      user = stub_employee_user(job_title_roles: [[:index, Timesheet]])
      expect(described_class.new(user, record)).to authorize(:index)
    end

    it "denies employee without permission" do
      expect(described_class.new(employee_user, record)).not_to authorize(:index)
    end

    it "denies client" do
      expect(described_class.new(client_user, record)).not_to authorize(:index)
    end
  end

  permissions :update? do
    it "allows admin" do
      expect(described_class.new(admin_user, record)).to authorize(:update)
    end

    it "allows employee with timesheet update permission" do
      user = stub_employee_user(job_title_roles: [[:update, Timesheet]])
      expect(described_class.new(user, record)).to authorize(:update)
    end

    it "denies employee without permission" do
      expect(described_class.new(employee_user, record)).not_to authorize(:update)
    end
  end
end
