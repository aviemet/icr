require "rails_helper"

RSpec.describe TimesheetPolicy, type: :policy do
  def stub_timesheet(employee:, id: 1)
    instance_double(Timesheet, employee: employee, employee_id: employee.id, id: id)
  end

  def stub_manager_user(managed_employee:, roles: [])
    current_managers = double
    allow(current_managers).to receive(:exists?).with(employee: managed_employee).and_return(true)
    employee = instance_double(
      Employee,
      id: 1,
      job_title: stub_job_title(roles: roles),
      managed_employees_managers: double(current: current_managers),
    )
    stub_employee_user(employee: employee)
  end

  describe ".scope" do
    before do
      @admin_user = create(:user).tap { |user| user.add_role(:admin) }
      @employee = create(:employee, :employed)
      @employee_user = create(:user, person: create(:person, employee: @employee))
      @client = create(:client)
      @client_user = create(:user, person: create(:person, client: @client))
      @job_title = create(:job_title)
      @employee_with_permission = create(:employee, :employed)
      @employee_with_permission.assign_job_title(@job_title)
      @employee_with_permission.reload
      @employee_user_with_permission = create(:user, person: create(:person, employee: @employee_with_permission))
    end

    it "returns all timesheets for admin" do
      @timesheets = create_list(:timesheet, 3)
      scope = Pundit.policy_scope(@admin_user, Timesheet)
      expect(scope.count).to eq(3)
      @timesheets.each { |timesheet| expect(scope).to include(timesheet) }
    end

    it "returns all timesheets for employee with index permission" do
      @job_title.add_role(:index, Timesheet)
      @employee_with_permission.reload

      @timesheets = create_list(:timesheet, 3)
      scope = Pundit.policy_scope(@employee_user_with_permission, Timesheet)
      expect(scope.count).to eq(3)
      @timesheets.each { |timesheet| expect(scope).to include(timesheet) }
    end

    it "returns only own timesheets for employee without permission" do
      own_timesheet = create(:timesheet, employee: @employee)
      other_timesheet = create(:timesheet)

      scope = Pundit.policy_scope(@employee_user, Timesheet)
      expect(scope).to include(own_timesheet)
      expect(scope).not_to include(other_timesheet)
    end

    it "returns none for client" do
      create_list(:timesheet, 3)
      scope = Pundit.policy_scope(@client_user, Timesheet)
      expect(scope.count).to eq(0)
    end

    it "returns none for user without person" do
      user = create(:user, person: nil)
      create_list(:timesheet, 3)
      scope = Pundit.policy_scope(user, Timesheet)
      expect(scope.count).to eq(0)
    end
  end

  permissions :index? do
    it "allows admin" do
      expect(described_class.new(stub_admin_user, Timesheet.new)).to authorize(:index)
    end

    it "allows employee with show permission to open payroll" do
      user = stub_employee_user(job_title_roles: [[:show, Timesheet]])
      expect(described_class.new(user, Timesheet.new)).to authorize(:index)
    end
  end

  permissions :show? do
    it "allows admin" do
      expect(described_class.new(stub_admin_user, Timesheet.new)).to authorize(:show)
    end

    it "allows employee to view own timesheet" do
      employee = instance_double(Employee, id: 1, job_title: stub_job_title)
      user = stub_employee_user(employee: employee)
      expect(described_class.new(user, stub_timesheet(employee: employee))).to authorize(:show)
    end

    it "allows manager to view managed employee timesheet" do
      managed_employee = build_stubbed(:employee)
      user = stub_manager_user(managed_employee: managed_employee)
      expect(described_class.new(user, stub_timesheet(employee: managed_employee))).to authorize(:show)
    end
  end

  permissions :update? do
    it "allows update for managed employee when job title has update" do
      managed_employee = build_stubbed(:employee)
      user = stub_manager_user(
        managed_employee: managed_employee,
        roles: [[:update, Timesheet]],
      )
      expect(described_class.new(user, stub_timesheet(employee: managed_employee))).to authorize(:update)
    end

    it "denies update for unmanaged employee when job title lacks index" do
      employee = instance_double(Employee, id: 1, job_title: stub_job_title(roles: [[:update, Timesheet]]))
      current_managers = double(exists?: false)
      allow(employee).to receive(:managed_employees_managers).and_return(double(current: current_managers))
      user = stub_employee_user(employee: employee)
      other_employee = build_stubbed(:employee)
      expect(described_class.new(user, stub_timesheet(employee: other_employee))).not_to authorize(:update)
    end

    it "allows update for any timesheet when job title has index and update" do
      roles = [[:index, Timesheet], [:update, Timesheet]]
      user = stub_employee_user(job_title_roles: roles)
      timesheet = stub_timesheet(employee: instance_double(Employee, id: 2))
      resolved_scope = double(exists?: true)
      allow(described_class::Scope).to receive(:new).and_return(double(resolve: resolved_scope))
      expect(described_class.new(user, timesheet)).to authorize(:update)
    end
  end

  permissions :final_approve? do
    it "allows admin" do
      expect(described_class.new(stub_admin_user, Timesheet.new)).to authorize(:final_approve)
    end

    it "allows index holders to final-approve without facilitator review" do
      roles = [[:index, Timesheet], [:update, Timesheet]]
      user = stub_employee_user(job_title_roles: roles)
      timesheet = stub_timesheet(employee: instance_double(Employee, id: 2))
      resolved_scope = double(exists?: true)
      allow(described_class::Scope).to receive(:new).and_return(double(resolve: resolved_scope))
      expect(described_class.new(user, timesheet)).to authorize(:final_approve)
    end

    it "denies facilitators with update but no index" do
      user = stub_employee_user(job_title_roles: [[:update, Timesheet]])
      timesheet = stub_timesheet(employee: instance_double(Employee, id: 2))
      expect(described_class.new(user, timesheet)).not_to authorize(:final_approve)
    end
  end
end
