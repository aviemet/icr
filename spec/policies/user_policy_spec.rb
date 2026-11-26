require "rails_helper"

RSpec.describe UserPolicy, type: :policy do
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

    it "returns all users for admin" do
      @users = create_list(:user, 3)
      scope = Pundit.policy_scope(@admin_user, User)
      expect(scope.count).to be >= 4
      @users.each { |user| expect(scope).to include(user) }
    end

    it "returns all users for employee with index permission" do
      @job_title.add_role(:index, User)
      @employee_with_permission.reload

      @users = create_list(:user, 3)
      scope = Pundit.policy_scope(@employee_user_with_permission, User)
      expect(scope.count).to be >= 5
      @users.each { |user| expect(scope).to include(user) }
    end

    it "returns only own user for employee without permission" do
      create_list(:user, 3)

      scope = Pundit.policy_scope(@employee_user, User)
      expect(scope).to include(@employee_user)
      expect(scope.count).to eq(1)
    end

    it "returns only own user for client" do
      create_list(:user, 3)

      scope = Pundit.policy_scope(@client_user, User)
      expect(scope).to include(@client_user)
      expect(scope.count).to eq(1)
    end

    it "returns none for user without person" do
      user = create(:user, person: nil)
      create_list(:user, 3)
      scope = Pundit.policy_scope(user, User)
      expect(scope.count).to eq(0)
    end
  end

  permissions :index? do
    it "allows admin" do
      expect(described_class.new(stub_admin_user, User.new)).to authorize(:index)
    end
  end

  permissions :show? do
    it "allows admin" do
      expect(described_class.new(stub_admin_user, User.new)).to authorize(:show)
    end

    it "allows a user to view their own settings" do
      user = instance_double(User, id: 1, has_role?: false, person: nil)
      expect(described_class.new(user, user)).to authorize(:show)
    end
  end

  permissions :update? do
    it "allows a user to update their own record" do
      user = instance_double(User, id: 1, has_role?: false, person: nil)
      expect(described_class.new(user, user)).to authorize(:update)
    end
  end
end
