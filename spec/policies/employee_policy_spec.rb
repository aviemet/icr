require "rails_helper"

RSpec.describe EmployeePolicy, type: :policy do
  let(:admin_user) { create(:user).tap { |u| u.add_role(:admin) } }
  let(:job_title) { create(:job_title) }
  let(:facilitator) { create(:employee, :employed) }
  let(:facilitator_user) do
    create(:user, person: facilitator.person).tap do
      facilitator.assign_job_title(job_title)
      facilitator.reload
    end
  end
  let(:hourly) { create(:employee, :employed) }
  let(:hourly_user) { create(:user, person: hourly.person) }
  let(:managed_employee) { create(:employee, :employed) }
  let(:other_employee) { create(:employee, :employed) }

  describe ".scope" do
    before do
      job_title.add_role(:index, Employee)
      job_title.add_role(:show, Employee)
    end

    it "returns all employees for facilitator with index" do
      scope = Pundit.policy_scope(facilitator_user, Employee)
      expect(scope).to include(managed_employee, other_employee, facilitator)
    end

    it "returns self and managed employees for hourly without index" do
      create(:employees_manager, manager: hourly, employee: managed_employee, starts_at: 1.day.ago)

      scope = Pundit.policy_scope(hourly_user, Employee)
      expect(scope).to include(hourly, managed_employee)
      expect(scope).not_to include(other_employee)
    end
  end

  permissions :update? do
    it "allows facilitator with update role for any employee" do
      user = stub_employee_user(job_title_roles: [[:update, Employee]])
      expect(described_class.new(user, instance_double(Employee))).to authorize(:update)
    end

    it "allows manager without update role for managed employee only" do
      managed_record = build_stubbed(:employee)
      other_record = build_stubbed(:employee)
      current_managers = double
      allow(current_managers).to receive(:exists?).with(employee: managed_record).and_return(true)
      allow(current_managers).to receive(:exists?).with(employee: other_record).and_return(false)
      manager_records = double(current: current_managers)
      manager = instance_double(Employee, job_title: stub_job_title, managed_employees_managers: manager_records)
      user = stub_employee_user(employee: manager)

      expect(described_class.new(user, managed_record)).to authorize(:update)
      expect(described_class.new(user, other_record)).not_to authorize(:update)
    end

    it "allows admin" do
      expect(described_class.new(stub_admin_user, instance_double(Employee))).to authorize(:update)
    end
  end

  permissions :show? do
    it "allows hourly to view self" do
      employee = instance_double(Employee, id: 1, job_title: stub_job_title)
      user = stub_employee_user(employee: employee)
      expect(described_class.new(user, employee)).to authorize(:show)
    end

    it "allows facilitator with show role to view any employee" do
      user = stub_employee_user(job_title_roles: [[:show, Employee]])
      expect(described_class.new(user, instance_double(Employee))).to authorize(:show)
    end
  end

  permissions :index? do
    it "allows facilitator with index role for a relation record" do
      user = stub_employee_user(job_title_roles: [[:index, Employee]])
      expect(described_class.new(user, Employee.all)).to authorize(:index)
    end

    it "denies hourly without index role" do
      expect(described_class.new(stub_employee_user, Employee.all)).not_to authorize(:index)
    end
  end
end
