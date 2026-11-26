require "rails_helper"

RSpec.describe ClientPolicy, type: :policy do
  def employee_user_with_client_relationship(attendant: false, manager: false)
    attendants = double(current: double(exists?: attendant))
    managers = double(current: double(exists?: manager))
    employee = instance_double(
      Employee,
      clients_attendants: attendants,
      clients_managers: managers,
      job_title: stub_job_title,
    )
    stub_employee_user(employee: employee)
  end

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
      @clients = create_list(:client, 3)
    end

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

    it "returns own client for client users" do
      scope = Pundit.policy_scope(@client_user, Client)
      expect(scope).to include(@client)
      expect(scope.count).to eq(1)
    end

    it "returns none for user without person" do
      user = create(:user, person: nil)
      scope = Pundit.policy_scope(user, Client)
      expect(scope.count).to eq(0)
    end
  end

  permissions :index? do
    it "allows admin" do
      expect(described_class.new(stub_admin_user, Client.new)).to authorize(:index)
    end

    it "allows employee with index permission" do
      user = stub_employee_user(job_title_roles: [[:index, Client]])
      expect(described_class.new(user, Client.new)).to authorize(:index)
    end

    it "allows employee with current attendant relationship" do
      user = employee_user_with_client_relationship(attendant: true)
      expect(described_class.new(user, Client.new)).to authorize(:index)
    end

    it "denies employee without permission or attendant relationship" do
      user = employee_user_with_client_relationship
      expect(described_class.new(user, Client.new)).not_to authorize(:index)
    end

    it "allows client users" do
      expect(described_class.new(stub_client_user, Client.new)).to authorize(:index)
    end
  end

  permissions :show? do
    it "allows admin" do
      expect(described_class.new(stub_admin_user, instance_double(Client))).to authorize(:show)
    end

    it "allows employee with show permission" do
      user = stub_employee_user(job_title_roles: [[:show, Client]])
      expect(described_class.new(user, instance_double(Client))).to authorize(:show)
    end

    it "allows employee who is current attendant" do
      client = build_stubbed(:client)
      current_attendants = double(exists?: true)
      allow(client).to receive(:clients_attendants).and_return(double(current: current_attendants))
      expect(described_class.new(stub_employee_user, client)).to authorize(:show)
    end

    it "denies employee without permission or attendant relationship" do
      client = build_stubbed(:client)
      current_relations = double(exists?: false)
      allow(client).to receive(:clients_attendants).and_return(double(current: current_relations))
      allow(client).to receive(:clients_managers).and_return(double(current: current_relations))
      expect(described_class.new(stub_employee_user, client)).not_to authorize(:show)
    end

    it "allows client users for own client" do
      client = instance_double(Client, id: 1)
      expect(described_class.new(stub_client_user(client: client), client)).to authorize(:show)
    end

    it "denies client users for other client" do
      user = stub_client_user(client: instance_double(Client, id: 1))
      expect(described_class.new(user, instance_double(Client, id: 2))).not_to authorize(:show)
    end
  end

  permissions :schedule? do
    it "allows admin" do
      expect(described_class.new(stub_admin_user, instance_double(Client))).to authorize(:schedule)
    end

    it "allows employee with show permission" do
      user = stub_employee_user(job_title_roles: [[:show, Client]])
      expect(described_class.new(user, instance_double(Client))).to authorize(:schedule)
    end

    it "allows employee who is current attendant" do
      client = build_stubbed(:client)
      allow(client).to receive(:clients_attendants).and_return(double(current: double(exists?: true)))
      expect(described_class.new(stub_employee_user, client)).to authorize(:schedule)
    end

    it "allows client users for own client" do
      client = instance_double(Client, id: 1)
      expect(described_class.new(stub_client_user(client: client), client)).to authorize(:schedule)
    end
  end

  permissions :new? do
    it "allows admin" do
      expect(described_class.new(stub_admin_user, Client.new)).to authorize(:new)
    end

    it "allows employee with create permission" do
      user = stub_employee_user(job_title_roles: [[:create, Client]])
      expect(described_class.new(user, Client.new)).to authorize(:new)
    end

    it "denies employee without create permission" do
      expect(described_class.new(stub_employee_user, Client.new)).not_to authorize(:new)
    end

    it "denies client" do
      expect(described_class.new(stub_client_user, Client.new)).not_to authorize(:new)
    end
  end

  permissions :create? do
    it "allows admin" do
      expect(described_class.new(stub_admin_user, Client.new)).to authorize(:create)
    end

    it "allows employee with create permission" do
      user = stub_employee_user(job_title_roles: [[:create, Client]])
      expect(described_class.new(user, Client.new)).to authorize(:create)
    end
  end

  permissions :edit? do
    it "allows admin" do
      expect(described_class.new(stub_admin_user, instance_double(Client))).to authorize(:edit)
    end

    it "allows employee with update permission" do
      user = stub_employee_user(job_title_roles: [[:update, Client]])
      expect(described_class.new(user, instance_double(Client))).to authorize(:edit)
    end

    it "allows employee who currently manages the client" do
      client = build_stubbed(:client)
      allow(client).to receive(:clients_managers).and_return(double(current: double(exists?: true)))
      expect(described_class.new(stub_employee_user, client)).to authorize(:edit)
    end

    it "denies employee who is only a current attendant" do
      client = build_stubbed(:client)
      allow(client).to receive(:clients_managers).and_return(double(current: double(exists?: false)))
      expect(described_class.new(stub_employee_user, client)).not_to authorize(:edit)
    end

    it "allows client users for own client" do
      client = instance_double(Client, id: 1)
      expect(described_class.new(stub_client_user(client: client), client)).to authorize(:edit)
    end

    it "denies client users for other client" do
      user = stub_client_user(client: instance_double(Client, id: 1))
      expect(described_class.new(user, instance_double(Client, id: 2))).not_to authorize(:edit)
    end
  end

  permissions :update? do
    it "allows admin" do
      expect(described_class.new(stub_admin_user, instance_double(Client))).to authorize(:update)
    end

    it "allows employee with update permission" do
      user = stub_employee_user(job_title_roles: [[:update, Client]])
      expect(described_class.new(user, instance_double(Client))).to authorize(:update)
    end
  end

  permissions :destroy? do
    it "allows admin" do
      expect(described_class.new(stub_admin_user, instance_double(Client))).to authorize(:destroy)
    end

    it "allows employee with destroy permission" do
      user = stub_employee_user(job_title_roles: [[:destroy, Client]])
      expect(described_class.new(user, instance_double(Client))).to authorize(:destroy)
    end

    it "denies employee without destroy permission" do
      expect(described_class.new(stub_employee_user, instance_double(Client))).not_to authorize(:destroy)
    end

    it "denies client" do
      expect(described_class.new(stub_client_user, instance_double(Client))).not_to authorize(:destroy)
    end
  end
end
