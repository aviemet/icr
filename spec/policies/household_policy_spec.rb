require "rails_helper"

RSpec.describe HouseholdPolicy, type: :policy do
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
    it "returns all households for admin" do
      households = create_list(:household, 3)
      scope = Pundit.policy_scope(@admin_user, Household)
      expect(scope.count).to eq(3)
      households.each { |household| expect(scope).to include(household) }
    end

    it "returns only households for clients employee attends" do
      household = create(:household)
      client = create(:client)
      create(:households_client, household: household, client: client)
      create(:clients_attendant, client: client, attendant: @employee, starts_at: 1.day.ago)

      other_household = create(:household)
      other_client = create(:client)
      create(:households_client, household: other_household, client: other_client)

      scope = Pundit.policy_scope(@employee_user, Household)
      expect(scope).to include(household)
      expect(scope).not_to include(other_household)
    end

    it "returns only households for client" do
      household = create(:household)
      create(:households_client, household: household, client: @client)

      other_household = create(:household)
      other_client = create(:client)
      create(:households_client, household: other_household, client: other_client)

      scope = Pundit.policy_scope(@client_user, Household)
      expect(scope).to include(household)
      expect(scope).not_to include(other_household)
    end

    it "returns none for user without person" do
      user = create(:user, person: nil)
      create_list(:household, 3)
      scope = Pundit.policy_scope(user, Household)
      expect(scope.count).to eq(0)
    end
  end

  permissions :index? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Household.new)).to authorize(:index)
    end

    it "allows employees even with no household assignments" do
      expect(described_class.new(@employee_user, Household.new)).to authorize(:index)
    end

    it "allows client users" do
      expect(described_class.new(@client_user, Household.new)).to authorize(:index)
    end
  end

  permissions :show? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Household.new)).to authorize(:show)
    end
  end

  permissions :create?, :update?, :destroy? do
    it "allows admin" do
      household = create(:household)
      expect(described_class.new(@admin_user, household)).to authorize(:create)
      expect(described_class.new(@admin_user, household)).to authorize(:update)
      expect(described_class.new(@admin_user, household)).to authorize(:destroy)
    end

    it "allows job titles with household grants" do
      @job_title.add_role(:create, Household)
      @job_title.add_role(:update, Household)
      @job_title.add_role(:destroy, Household)
      household = create(:household)

      policy = described_class.new(@employee_user_with_permission, household)
      expect(policy).to authorize(:create)
      expect(policy).to authorize(:update)
      expect(policy).to authorize(:destroy)
    end
  end

  describe ".scope with historical membership" do
    it "excludes households for attendants of only former members" do
      household = create(:household)
      client = create(:client)
      create(
        :households_client,
        household: household,
        client: client,
        starts_at: 30.days.ago.to_date,
        ends_at: 1.day.ago.to_date,
      )
      create(:clients_attendant, client: client, attendant: @employee, starts_at: 1.day.ago)

      scope = Pundit.policy_scope(@employee_user, Household)
      expect(scope).not_to include(household)
    end
  end
end
