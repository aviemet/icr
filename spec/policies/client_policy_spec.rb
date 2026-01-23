require "rails_helper"

RSpec.describe ClientPolicy, type: :policy do
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
    @clients = create_list(:client, 3)
  end

  describe ".scope" do
    it "returns all clients for admin" do
      scope = Pundit.policy_scope(@admin_user, Client)
      expect(scope.count).to be >= 4
      expect(scope).to include(@client)
      @clients.each { |client| expect(scope).to include(client) }
    end

    it "returns all clients for employee with index permission" do
      @job_title.add_role(:index, Client)
      @employee_with_permission.reload

      scope = Pundit.policy_scope(@employee_user_with_permission, Client)
      expect(scope.count).to be >= 4
      expect(scope).to include(@client)
      @clients.each { |client| expect(scope).to include(client) }
    end

    it "returns only clients where employee is current attendant" do
      attendant_client = @clients.first
      create(:clients_attendant, client: attendant_client, attendant: @employee, starts_at: 1.day.ago)
      other_client = @clients.last

      scope = Pundit.policy_scope(@employee_user, Client)
      expect(scope).to include(attendant_client)
      expect(scope).not_to include(other_client)
      expect(scope.count).to eq(1)
    end

    it "returns own client for client with index permission" do
      role = Role.find_or_create_by!(name: "index", resource_type: "Client", resource_id: nil)
      @client_user.roles << role unless @client_user.roles.include?(role)

      scope = Pundit.policy_scope(@client_user, Client)
      expect(scope).to include(@client)
      expect(scope.count).to eq(1)
    end

    it "returns none for client without index permission" do
      scope = Pundit.policy_scope(@client_user, Client)
      expect(scope.count).to eq(0)
    end

    it "returns none for user without person" do
      user = create(:user, person: nil)
      scope = Pundit.policy_scope(user, Client)
      expect(scope.count).to eq(0)
    end
  end

  permissions :index? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Client.new)).to authorize(:index)
    end

    it "allows employee with index permission" do
      @job_title.add_role(:index, Client)
      @employee_with_permission.reload

      expect(described_class.new(@employee_user_with_permission, Client.new)).to authorize(:index)
    end

    it "allows employee with current attendant relationship" do
      client = create(:client)
      create(:clients_attendant, client: client, attendant: @employee, starts_at: 1.day.ago)

      expect(described_class.new(@employee_user, Client.new)).to authorize(:index)
    end

    it "denies employee without permission or attendant relationship" do
      expect(described_class.new(@employee_user, Client.new)).not_to authorize(:index)
    end

    it "allows client with index permission" do
      role = Role.find_or_create_by!(name: "index", resource_type: "Client", resource_id: nil)
      @client_user.roles << role unless @client_user.roles.include?(role)

      expect(described_class.new(@client_user, Client.new)).to authorize(:index)
    end

    it "denies client without index permission" do
      expect(described_class.new(@client_user, Client.new)).not_to authorize(:index)
    end
  end

  permissions :show? do
    it "allows admin" do
      expect(described_class.new(@admin_user, @client)).to authorize(:show)
    end

    it "allows employee with show permission" do
      @job_title.add_role(:show, Client)
      @employee_with_permission.reload

      expect(described_class.new(@employee_user_with_permission, @client)).to authorize(:show)
    end

    it "allows employee who is current attendant" do
      create(:clients_attendant, client: @client, attendant: @employee, starts_at: 1.day.ago)

      expect(described_class.new(@employee_user, @client)).to authorize(:show)
    end

    it "denies employee without permission or attendant relationship" do
      other_client = @clients.first
      expect(described_class.new(@employee_user, other_client)).not_to authorize(:show)
    end

    it "allows client with show permission for own client" do
      role = Role.find_or_create_by!(name: "show", resource_type: "Client", resource_id: nil)
      @client_user.roles << role unless @client_user.roles.include?(role)

      expect(described_class.new(@client_user, @client)).to authorize(:show)
    end

    it "denies client with show permission for other client" do
      role = Role.find_or_create_by!(name: "show", resource_type: "Client", resource_id: nil)
      @client_user.roles << role unless @client_user.roles.include?(role)
      other_client = @clients.first

      expect(described_class.new(@client_user, other_client)).not_to authorize(:show)
    end

    it "denies client without show permission" do
      expect(described_class.new(@client_user, @client)).not_to authorize(:show)
    end
  end

  permissions :schedule? do
    it "allows admin" do
      expect(described_class.new(@admin_user, @client)).to authorize(:schedule)
    end

    it "allows employee with show permission" do
      @job_title.add_role(:show, Client)
      @employee_with_permission.reload

      expect(described_class.new(@employee_user_with_permission, @client)).to authorize(:schedule)
    end

    it "allows employee who is current attendant" do
      create(:clients_attendant, client: @client, attendant: @employee, starts_at: 1.day.ago)

      expect(described_class.new(@employee_user, @client)).to authorize(:schedule)
    end

    it "allows client with show permission for own client" do
      role = Role.find_or_create_by!(name: "show", resource_type: "Client", resource_id: nil)
      @client_user.roles << role unless @client_user.roles.include?(role)

      expect(described_class.new(@client_user, @client)).to authorize(:schedule)
    end
  end

  permissions :new? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Client.new)).to authorize(:new)
    end

    it "allows employee with create permission" do
      @job_title.add_role(:create, Client)
      @employee_with_permission.reload

      expect(described_class.new(@employee_user_with_permission, Client.new)).to authorize(:new)
    end

    it "denies employee without create permission" do
      expect(described_class.new(@employee_user, Client.new)).not_to authorize(:new)
    end

    it "denies client" do
      expect(described_class.new(@client_user, Client.new)).not_to authorize(:new)
    end
  end

  permissions :create? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Client.new)).to authorize(:create)
    end

    it "allows employee with create permission" do
      @job_title.add_role(:create, Client)
      @employee_with_permission.reload

      expect(described_class.new(@employee_user_with_permission, Client.new)).to authorize(:create)
    end
  end

  permissions :edit? do
    it "allows admin" do
      expect(described_class.new(@admin_user, @client)).to authorize(:edit)
    end

    it "allows employee with update permission" do
      @job_title.add_role(:update, Client)
      @employee_with_permission.reload

      expect(described_class.new(@employee_user_with_permission, @client)).to authorize(:edit)
    end

    it "allows employee who is current attendant" do
      create(:clients_attendant, client: @client, attendant: @employee, starts_at: 1.day.ago)

      expect(described_class.new(@employee_user, @client)).to authorize(:edit)
    end

    it "allows client with update permission for own client" do
      role = Role.find_or_create_by!(name: "update", resource_type: "Client", resource_id: nil)
      @client_user.roles << role unless @client_user.roles.include?(role)

      expect(described_class.new(@client_user, @client)).to authorize(:edit)
    end

    it "denies client with update permission for other client" do
      role = Role.find_or_create_by!(name: "update", resource_type: "Client", resource_id: nil)
      @client_user.roles << role unless @client_user.roles.include?(role)
      other_client = @clients.first

      expect(described_class.new(@client_user, other_client)).not_to authorize(:edit)
    end
  end

  permissions :update? do
    it "allows admin" do
      expect(described_class.new(@admin_user, @client)).to authorize(:update)
    end

    it "allows employee with update permission" do
      @job_title.add_role(:update, Client)
      @employee_with_permission.reload

      expect(described_class.new(@employee_user_with_permission, @client)).to authorize(:update)
    end
  end

  permissions :destroy? do
    it "allows admin" do
      expect(described_class.new(@admin_user, @client)).to authorize(:destroy)
    end

    it "allows employee with destroy permission" do
      @job_title.add_role(:destroy, Client)
      @employee_with_permission.reload

      expect(described_class.new(@employee_user_with_permission, @client)).to authorize(:destroy)
    end

    it "denies employee without destroy permission" do
      expect(described_class.new(@employee_user, @client)).not_to authorize(:destroy)
    end

    it "denies client" do
      expect(described_class.new(@client_user, @client)).not_to authorize(:destroy)
    end
  end
end
