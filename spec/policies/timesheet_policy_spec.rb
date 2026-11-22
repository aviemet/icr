require "rails_helper"

RSpec.describe TimesheetPolicy, type: :policy do
  before do
    @admin_user = create(:user).tap { |u| u.add_role(:admin) }
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

  describe ".scope" do
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
      expect(described_class.new(@admin_user, Timesheet.new)).to authorize(:index)
    end

    it "allows employee with show permission to open payroll" do
      @job_title.add_role(:show, Timesheet)
      @employee_with_permission.reload

      expect(described_class.new(@employee_user_with_permission, Timesheet.new)).to authorize(:index)
    end
  end

  permissions :show? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Timesheet.new)).to authorize(:show)
    end

    it "allows employee to view own timesheet" do
      timesheet = create(:timesheet, employee: @employee)

      expect(described_class.new(@employee_user, timesheet)).to authorize(:show)
    end

    it "allows manager to view managed employee timesheet" do
      managed = create(:employee, :employed)
      create(:employees_manager, manager: @employee, employee: managed, starts_at: 1.day.ago)
      timesheet = create(:timesheet, employee: managed)

      expect(described_class.new(@employee_user, timesheet)).to authorize(:show)
    end
  end

  permissions :update? do
    it "allows update for managed employee when job title has update" do
      @job_title.add_role(:update, Timesheet)
      @employee_with_permission.reload
      managed = create(:employee, :employed)
      create(:employees_manager, manager: @employee_with_permission, employee: managed, starts_at: 1.day.ago)
      timesheet = create(:timesheet, employee: managed)

      expect(described_class.new(@employee_user_with_permission, timesheet)).to authorize(:update)
    end

    it "denies update for unmanaged employee when job title lacks index" do
      @job_title.add_role(:update, Timesheet)
      @employee_with_permission.reload
      timesheet = create(:timesheet)

      expect(described_class.new(@employee_user_with_permission, timesheet)).not_to authorize(:update)
    end

    it "allows update for any timesheet when job title has index and update" do
      @job_title.add_role(:index, Timesheet)
      @job_title.add_role(:update, Timesheet)
      @employee_with_permission.reload
      timesheet = create(:timesheet)

      expect(described_class.new(@employee_user_with_permission, timesheet)).to authorize(:update)
    end
  end

  permissions :final_approve? do
    it "allows admin" do
      timesheet = create(:timesheet, pay_period: create(:pay_period, finalized_at: nil))

      expect(described_class.new(@admin_user, timesheet)).to authorize(:final_approve)
    end

    it "allows index holders to final-approve without facilitator review" do
      @job_title.add_role(:index, Timesheet)
      @job_title.add_role(:update, Timesheet)
      @employee_with_permission.reload
      timesheet = create(:timesheet, pay_period: create(:pay_period, finalized_at: nil))

      expect(described_class.new(@employee_user_with_permission, timesheet)).to authorize(:final_approve)
    end

    it "denies facilitators with update but no index" do
      @job_title.add_role(:update, Timesheet)
      @employee_with_permission.reload
      managed = create(:employee, :employed)
      create(:employees_manager, manager: @employee_with_permission, employee: managed, starts_at: 1.day.ago)
      timesheet = create(:timesheet, employee: managed, pay_period: create(:pay_period, finalized_at: nil))

      expect(described_class.new(@employee_user_with_permission, timesheet)).not_to authorize(:final_approve)
    end
  end
end
