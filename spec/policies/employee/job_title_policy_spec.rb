require "rails_helper"

RSpec.describe Employee::JobTitlePolicy, type: :policy do
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
    it "returns all job titles for admin" do
      @job_titles = create_list(:job_title, 3)
      scope = Pundit.policy_scope(@admin_user, Employee::JobTitle)
      expect(scope.count).to be >= 4
      @job_titles.each { |jt| expect(scope).to include(jt) }
    end

    it "returns all job titles for employee with index permission" do
      @job_title.add_role(:index, Employee::JobTitle)
      @employee_with_permission.reload

      @job_titles = create_list(:job_title, 3)
      scope = Pundit.policy_scope(@employee_user_with_permission, Employee::JobTitle)
      expect(scope.count).to be >= 4
      @job_titles.each { |jt| expect(scope).to include(jt) }
    end

    it "returns only own job title for employee without permission" do
      own_job_title = create(:job_title)
      @employee.assign_job_title(own_job_title)
      @employee.reload
      other_job_title = create(:job_title)

      scope = Pundit.policy_scope(@employee_user, Employee::JobTitle)
      expect(scope).to include(own_job_title)
      expect(scope).not_to include(other_job_title)
      expect(scope.count).to eq(1)
    end

    it "returns none for employee without permission and no job title" do
      create_list(:job_title, 3)
      scope = Pundit.policy_scope(@employee_user, Employee::JobTitle)
      expect(scope.count).to eq(0)
    end

    it "returns none for client" do
      create_list(:job_title, 3)
      scope = Pundit.policy_scope(@client_user, Employee::JobTitle)
      expect(scope.count).to eq(0)
    end

    it "returns none for user without person" do
      user = create(:user, person: nil)
      create_list(:job_title, 3)
      scope = Pundit.policy_scope(user, Employee::JobTitle)
      expect(scope.count).to eq(0)
    end
  end

  permissions :index? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Employee::JobTitle.new)).to authorize(:index)
    end
  end

  permissions :show? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Employee::JobTitle.new)).to authorize(:show)
    end
  end
end
