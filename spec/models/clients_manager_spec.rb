# == Schema Information
#
# Table name: clients_managers
#
#  id         :uuid             not null, primary key
#  ends_at    :datetime
#  starts_at  :datetime         not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  client_id  :uuid             not null
#  manager_id :uuid             not null
#
# Indexes
#
#  index_clients_managers_on_client_id         (client_id)
#  index_clients_managers_on_manager_id        (manager_id)
#  index_clients_managers_unique_relationship  (manager_id,client_id) UNIQUE WHERE (ends_at IS NULL)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (manager_id => employees.id)
#
require "rails_helper"

RSpec.describe ClientsManager do
  describe "associations" do
    it { is_expected.to belong_to(:manager).class_name("Employee") }
    it { is_expected.to belong_to(:client) }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:starts_at) }

    context "when ends_at is present" do
      it "validates ends_at is after starts_at" do
        employee = create(:employee)
        client = create(:client)
        clients_manager = build(:clients_manager,
          manager: employee,
          client: client,
          starts_at: 1.day.from_now,
          ends_at: 1.day.ago,)

        expect(clients_manager).not_to be_valid
        expect(clients_manager.errors[:ends_at]).to include("must be after starts_at")
      end
    end

    context "when checking uniqueness" do
      it "prevents duplicate active relationships" do
        employee = create(:employee)
        client = create(:client)

        create(:clients_manager,
          manager: employee,
          client: client,
          starts_at: Time.current,
          ends_at: nil,)

        duplicate = build(:clients_manager,
          manager: employee,
          client: client,
          starts_at: Time.current,
          ends_at: nil,)

        expect(duplicate).not_to be_valid
        expect(duplicate.errors[:manager_id]).to include("Already manages")
      end

      it "allows new relationship if previous one is ended" do
        employee = create(:employee)
        client = create(:client)

        create(:clients_manager,
          manager: employee,
          client: client,
          starts_at: 2.days.ago,
          ends_at: 1.day.ago,)

        new_relationship = build(:clients_manager,
          manager: employee,
          client: client,
          starts_at: Time.current,
          ends_at: nil,)

        expect(new_relationship).to be_valid
      end
    end
  end

  describe "defaults" do
    it "sets starts_at to current time by default" do
      freeze_time do
        clients_manager = described_class.new
        expect(clients_manager.starts_at).to eq(Time.current)
      end
    end
  end

  describe "scopes" do
    describe ".current" do
      it "returns only current relationships" do
        employee = create(:employee)
        client = create(:client)

        active_relationship = create(:clients_manager,
          manager: employee,
          client: client,
          starts_at: 1.day.ago,
          ends_at: nil,)

        create(:clients_manager,
          manager: create(:employee),
          client: create(:client),
          starts_at: 1.day.from_now,
          ends_at: nil,)

        create(:clients_manager,
          manager: create(:employee),
          client: create(:client),
          starts_at: 2.days.ago,
          ends_at: 1.day.ago,)

        expect(described_class.current).to contain_exactly(active_relationship)
      end
    end

    describe ".includes_associated" do
      it "includes manager and client associations" do
        relation = described_class.includes_associated
        expect(relation.includes_values).to include(:manager, :client)
      end
    end
  end
end
