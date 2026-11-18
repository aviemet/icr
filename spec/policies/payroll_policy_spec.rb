require "rails_helper"

RSpec.describe PayrollPolicy, type: :policy do
  let(:admin_user) { create(:user).tap { |u| u.add_role(:admin) } }
  let(:employee) { create(:employee, :employed) }
  let(:employee_user) { create(:user, person: employee.person) }
  let(:client_user) { create(:user, person: create(:client).person) }
  let(:job_title) { create(:job_title) }
  let(:employee_with_permission) do
    create(:employee, :employed).tap do |record|
      record.assign_job_title(job_title)
      record.reload
    end
  end
  let(:employee_user_with_permission) { create(:user, person: employee_with_permission.person) }
  let(:record) { Timesheet.new }

  permissions :index? do
    it "allows admin" do
      expect(described_class.new(admin_user, record)).to authorize(:index)
    end

    it "allows employee with timesheet index permission" do
      job_title.add_role(:index, Timesheet)

      expect(described_class.new(employee_user_with_permission, record)).to authorize(:index)
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
      job_title.add_role(:update, Timesheet)

      expect(described_class.new(employee_user_with_permission, record)).to authorize(:update)
    end

    it "denies employee without permission" do
      expect(described_class.new(employee_user, record)).not_to authorize(:update)
    end
  end
end
