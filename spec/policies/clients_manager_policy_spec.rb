require "rails_helper"

RSpec.describe ClientsManagerPolicy, type: :policy do
  let(:admin_user) { stub_admin_user }
  let(:facilitator_user) { stub_employee_user }
  let(:director_user) do
    stub_employee_user(
      job_title_roles: [
        [:index, ClientsManager],
        [:create, ClientsManager],
        [:update, ClientsManager],
      ],
    )
  end

  permissions :index?, :create?, :update? do
    it "allows admin" do
      expect(described_class.new(admin_user, ClientsManager)).to authorize(:index)
      expect(described_class.new(admin_user, ClientsManager)).to authorize(:create)
      expect(described_class.new(admin_user, ClientsManager.new)).to authorize(:update)
    end

    it "allows director with admin sync grants" do
      expect(described_class.new(director_user, ClientsManager)).to authorize(:index)
      expect(described_class.new(director_user, ClientsManager)).to authorize(:create)
      expect(described_class.new(director_user, ClientsManager.new)).to authorize(:update)
    end

    it "denies facilitator without clients_manager roles" do
      expect(described_class.new(facilitator_user, ClientsManager)).not_to authorize(:index)
      expect(described_class.new(facilitator_user, ClientsManager)).not_to authorize(:create)
      expect(described_class.new(facilitator_user, ClientsManager.new)).not_to authorize(:update)
    end
  end
end
