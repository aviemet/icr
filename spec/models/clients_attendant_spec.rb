# == Schema Information
#
# Table name: clients_attendants
#
#  id           :uuid             not null, primary key
#  starts_at    :datetime
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  attendant_id :uuid             not null
#  client_id    :uuid             not null
#
# Indexes
#
#  index_clients_attendants_on_attendant_id      (attendant_id)
#  index_clients_attendants_on_client_id         (client_id)
#  index_clients_attendants_unique_relationship  (attendant_id,client_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (attendant_id => employees.id)
#  fk_rails_...  (client_id => clients.id)
#
require "rails_helper"

RSpec.describe ClientsAttendant, type: :model do
  subject(:clients_attendant) { build(:clients_attendant) }

  describe "associations" do
    it { is_expected.to belong_to(:attendant).class_name("Employee") }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:starts_at) }

    describe "uniqueness validation" do
      let(:attendant) { create(:employee) }
      let(:client) { create(:client) }

      before do
        create(:clients_attendant, attendant: attendant, client: client, starts_at: 2.days.ago)
        clients_attendant.attendant = attendant
        clients_attendant.client = client
        clients_attendant.starts_at = 1.day.ago
      end

      it "validates uniqueness of attendant_id scoped to client_id" do
        expect(clients_attendant).not_to be_valid
        expect(clients_attendant.errors[:attendant_id]).to include(
          I18n.t("activerecord.errors.models.clients_attendant.attributes.attendant_id.already_attends"),
        )
      end
    end
  end

  describe "requirement gates" do
    let(:attendant) { create(:employee, :employed) }
    let(:client) { create(:client) }
    let(:training) { create(:training, name: "Client Protocol") }

    before do
      requirement = create(:requirement, :for_client, scope: client, name: "Protocol")
      create(:requirement_item, requirement: requirement, fulfillable: training)
    end

    it "rejects create when client schedule requirements are unmet" do
      record = build(:clients_attendant, attendant: attendant, client: client)

      expect(record.valid?(:create)).to be(false)
      expect(record.errors[:base].join).to include("Protocol")
    end

    it "allows create when client schedule requirements are met" do
      create(:employees_training, :completed, employee: attendant, training: training)
      record = build(:clients_attendant, attendant: attendant, client: client)

      expect(record.valid?(:create)).to be(true)
    end
  end

  describe "defaults" do
    it "sets starts_at to current time by default" do
      freeze_time do
        expect(described_class.new.starts_at).to be_within(1.second).of(Time.current)
      end
    end
  end

  describe "scopes" do
    describe ".current" do
      let!(:future_relationship) do
        create(:clients_attendant, starts_at: 1.day.from_now)
      end

      let!(:current_relationship) do
        create(:clients_attendant, starts_at: 1.day.ago)
      end

      it "includes relationships that started in the past" do
        expect(described_class.current).to include(current_relationship)
      end

      it "excludes relationships that start in the future" do
        expect(described_class.current).not_to include(future_relationship)
      end
    end

    describe ".includes_associated" do
      it "includes attendant and client associations" do
        relation = described_class.includes_associated
        expect(relation.includes_values).to include(:attendant, :client)
      end
    end
  end
end
