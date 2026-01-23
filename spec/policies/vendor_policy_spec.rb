require "rails_helper"

RSpec.describe VendorPolicy, type: :policy do
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
    it "returns all vendors for admin" do
      @vendors = create_list(:vendor, 3)
      scope = Pundit.policy_scope(@admin_user, Vendor)
      expect(scope.count).to eq(3)
      @vendors.each { |vendor| expect(scope).to include(vendor) }
    end

    it "returns all vendors for employee with index permission" do
      @job_title.add_role(:index, Vendor)
      @employee_with_permission.reload

      @vendors = create_list(:vendor, 3)
      scope = Pundit.policy_scope(@employee_user_with_permission, Vendor)
      expect(scope.count).to eq(3)
      @vendors.each { |vendor| expect(scope).to include(vendor) }
    end

    it "returns none for employee without permission" do
      create_list(:vendor, 3)
      scope = Pundit.policy_scope(@employee_user, Vendor)
      expect(scope.count).to eq(0)
    end

    it "returns none for client" do
      create_list(:vendor, 3)
      scope = Pundit.policy_scope(@client_user, Vendor)
      expect(scope.count).to eq(0)
    end

    it "returns none for user without person" do
      user = create(:user, person: nil)
      create_list(:vendor, 3)
      scope = Pundit.policy_scope(user, Vendor)
      expect(scope.count).to eq(0)
    end
  end

  permissions :index? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Vendor.new)).to authorize(:index)
    end
  end

  permissions :show? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Vendor.new)).to authorize(:show)
    end
  end
end
