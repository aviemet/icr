require "rails_helper"

RSpec.describe ShiftTemplatePolicy, type: :policy do
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
    it "returns all shift_templates for admin" do
      @shift_templates = create_list(:shift_template, 3)
      scope = Pundit.policy_scope(@admin_user, ShiftTemplate)
      expect(scope.count).to eq(3)
      @shift_templates.each { |shift_template| expect(scope).to include(shift_template) }
    end

    it "returns all shift_templates for employee with index permission" do
      @job_title.add_role(:index, ShiftTemplate)
      @employee_with_permission.reload

      @shift_templates = create_list(:shift_template, 3)
      scope = Pundit.policy_scope(@employee_user_with_permission, ShiftTemplate)
      expect(scope.count).to eq(3)
      @shift_templates.each { |shift_template| expect(scope).to include(shift_template) }
    end

    it "returns none for employee without permission" do
      create_list(:shift_template, 3)
      scope = Pundit.policy_scope(@employee_user, ShiftTemplate)
      expect(scope.count).to eq(0)
    end

    it "returns none for client" do
      create_list(:shift_template, 3)
      scope = Pundit.policy_scope(@client_user, ShiftTemplate)
      expect(scope.count).to eq(0)
    end

    it "returns none for user without person" do
      user = create(:user, person: nil)
      create_list(:shift_template, 3)
      scope = Pundit.policy_scope(user, ShiftTemplate)
      expect(scope.count).to eq(0)
    end
  end

  permissions :index? do
    it "allows admin" do
      expect(described_class.new(@admin_user, ShiftTemplate.new)).to authorize(:index)
    end
  end

  permissions :show? do
    it "allows admin" do
      expect(described_class.new(@admin_user, ShiftTemplate.new)).to authorize(:show)
    end
  end
end
