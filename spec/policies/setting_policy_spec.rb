require "rails_helper"

RSpec.describe SettingPolicy, type: :policy do
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
    it "returns all settings for admin" do
      scope = Pundit.policy_scope(@admin_user, Setting)
      expect(scope).to be_a(ActiveRecord::Relation)
    end

    it "returns all settings for employee with index permission" do
      @job_title.add_role(:index, Setting)
      @employee_with_permission.reload

      scope = Pundit.policy_scope(@employee_user_with_permission, Setting)
      expect(scope).to be_a(ActiveRecord::Relation)
    end

    it "returns none for employee without permission" do
      scope = Pundit.policy_scope(@employee_user, Setting)
      expect(scope.count).to eq(0)
    end

    it "returns none for client" do
      scope = Pundit.policy_scope(@client_user, Setting)
      expect(scope.count).to eq(0)
    end
  end

  permissions :index? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Setting.new)).to authorize(:index)
    end
  end

  permissions :show? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Setting.new)).to authorize(:show)
    end
  end
end
