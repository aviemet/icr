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
  end

  permissions :show? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Timesheet.new)).to authorize(:show)
    end
  end
end
