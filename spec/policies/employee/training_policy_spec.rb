require "rails_helper"

RSpec.describe Employee::TrainingPolicy, type: :policy do
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
    it "returns all trainings for admin" do
      @trainings = create_list(:training, 3)
      scope = Pundit.policy_scope(@admin_user, Employee::Training)
      expect(scope.count).to be >= 3
      @trainings.each { |t| expect(scope).to include(t) }
    end

    it "returns all trainings for employee with index permission" do
      @job_title.add_role(:index, Employee::Training)
      @employee_with_permission.reload

      @trainings = create_list(:training, 3)
      scope = Pundit.policy_scope(@employee_user_with_permission, Employee::Training)
      expect(scope.count).to be >= 3
      @trainings.each { |t| expect(scope).to include(t) }
    end

    it "returns only trainings assigned to employee without permission" do
      assigned_training = create(:training)
      create(:employees_training, employee: @employee, training: assigned_training)
      other_training = create(:training)

      scope = Pundit.policy_scope(@employee_user, Employee::Training)
      expect(scope).to include(assigned_training)
      expect(scope).not_to include(other_training)
      expect(scope.count).to eq(1)
    end

    it "returns none for employee without permission and no assigned trainings" do
      create_list(:training, 3)
      scope = Pundit.policy_scope(@employee_user, Employee::Training)
      expect(scope.count).to eq(0)
    end

    it "returns none for client" do
      create_list(:training, 3)
      scope = Pundit.policy_scope(@client_user, Employee::Training)
      expect(scope.count).to eq(0)
    end

    it "returns none for user without person" do
      user = create(:user, person: nil)
      create_list(:training, 3)
      scope = Pundit.policy_scope(user, Employee::Training)
      expect(scope.count).to eq(0)
    end
  end

  permissions :index? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Employee::Training.new)).to authorize(:index)
    end
  end

  permissions :show? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Employee::Training.new)).to authorize(:show)
    end
  end

  permissions :create? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Employee::Training.new)).to authorize(:create)
    end
  end

  permissions :update? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Employee::Training.new)).to authorize(:update)
    end
  end

  permissions :destroy? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Employee::Training.new)).to authorize(:destroy)
    end
  end
end
