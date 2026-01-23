require "rails_helper"

RSpec.describe EmployeePolicy, type: :policy do
  before do
    @admin_user = create(:user).tap { |u| u.add_role(:admin) }
    @employee = create(:employee, :employed)
    @employee_user = create(:user, person: create(:person, employee: @employee))
    @client = create(:client)
    @client_user = create(:user, person: create(:person, client: @client))
    @employees = create_list(:employee, 3, :employed)
  end

  describe ".scope" do
    it "returns all employees for admin" do
      scope = Pundit.policy_scope(@admin_user, Employee)
      expect(scope.count).to be >= 4
      expect(scope).to include(@employee)
      @employees.each { |emp| expect(scope).to include(emp) }
    end

    it "returns all employees for employee with index permission" do
      job_title = create(:job_title)
      job_title.add_role(:index, Employee)
      @employee.assign_job_title(job_title)
      @employee.reload

      scope = Pundit.policy_scope(@employee_user, Employee)
      expect(scope.count).to be >= 4
      expect(scope).to include(@employee)
      @employees.each { |emp| expect(scope).to include(emp) }
    end

    it "returns only own employee for employee without permission" do
      other_employee = @employees.first
      scope = Pundit.policy_scope(@employee_user, Employee)
      expect(scope).to include(@employee)
      expect(scope).not_to include(other_employee)
      expect(scope.count).to eq(1)
    end

    it "returns employees who are current attendants for client" do
      attendant_employee = @employees.first
      create(:clients_attendant, client: @client, attendant: attendant_employee, starts_at: 1.day.ago)
      other_employee = @employees.last

      scope = Pundit.policy_scope(@client_user, Employee)
      expect(scope).to include(attendant_employee)
      expect(scope).not_to include(other_employee)
      expect(scope.count).to eq(1)
    end

    it "returns none for user without person" do
      user = create(:user, person: nil)
      scope = Pundit.policy_scope(user, Employee)
      expect(scope.count).to eq(0)
    end
  end

  permissions :index? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Employee.new)).to authorize(:index)
    end
  end

  permissions :show? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Employee.new)).to authorize(:show)
    end
  end
end
