require "rails_helper"

RSpec.describe PersonPolicy, type: :policy do
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
    it "returns all people for admin" do
      @people = create_list(:person, 3)
      scope = Pundit.policy_scope(@admin_user, Person)
      expect(scope.count).to be >= 4
      @people.each { |person| expect(scope).to include(person) }
    end

    it "returns all people for employee with index permission" do
      @job_title.add_role(:index, Person)
      @employee_with_permission.reload

      @people = create_list(:person, 3)
      scope = Pundit.policy_scope(@employee_user_with_permission, Person)
      expect(scope.count).to be >= 5
      @people.each { |person| expect(scope).to include(person) }
    end

    it "returns only own person for employee without permission" do
      employee_person = @employee_user.person
      create(:person)

      scope = Pundit.policy_scope(@employee_user, Person)
      expect(scope).to include(employee_person)
      expect(scope.count).to eq(1)
    end

    it "returns only own person for client" do
      client_person = @client_user.person
      create(:person)

      scope = Pundit.policy_scope(@client_user, Person)
      expect(scope).to include(client_person)
      expect(scope.count).to eq(1)
    end

    it "returns none for user without person" do
      user = create(:user, person: nil)
      create_list(:person, 3)
      scope = Pundit.policy_scope(user, Person)
      expect(scope.count).to eq(0)
    end
  end

  permissions :index? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Person.new)).to authorize(:index)
    end
  end

  permissions :show? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Person.new)).to authorize(:show)
    end
  end
end
