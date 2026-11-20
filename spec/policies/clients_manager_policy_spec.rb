require "rails_helper"

RSpec.describe ClientsManagerPolicy, type: :policy do
  let(:admin_user) { create(:user).tap { |user| user.add_role(:admin) } }
  let(:job_title) { create(:job_title) }
  let(:facilitator) { create(:employee, :employed) }
  let(:facilitator_user) do
    create(:user, person: facilitator.person).tap do
      facilitator.assign_job_title(job_title)
      facilitator.reload
    end
  end
  let(:director_title) { create(:job_title, name: "Director Ops") }
  let(:director) { create(:employee, :employed) }
  let(:director_user) do
    create(:user, person: director.person).tap do
      director.assign_job_title(director_title)
      director.reload
    end
  end

  before do
    Employee::JobTitle::SyncPermissions.call(director_title, { "admin" => true })
    director.reload
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
