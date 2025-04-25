# == Schema Information
#
# Table name: clients_attendants
#
#  id           :uuid             not null, primary key
#  ends_at      :datetime
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
#  index_clients_attendants_unique_relationship  (attendant_id,client_id) UNIQUE WHERE (ends_at IS NULL)
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
    it { is_expected.to belong_to(:client) }
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

      it "validates uniqueness of attendant_id scoped to client_id when ends_at is nil" do
        expect(clients_attendant).not_to be_valid
        expect(clients_attendant.errors[:attendant_id]).to include("already attends this client")
      end

      it "allows duplicate relationships when previous relationship has ended" do
        described_class.last.update!(ends_at: Time.current)
        expect(clients_attendant).to be_valid
      end
    end

    describe "ends_at validation" do
      it "is valid when ends_at is after starts_at" do
        clients_attendant.ends_at = clients_attendant.starts_at + 1.day
        expect(clients_attendant).to be_valid
      end

      it "is invalid when ends_at is before starts_at" do
        clients_attendant.ends_at = clients_attendant.starts_at - 1.day
        expect(clients_attendant).not_to be_valid
        expect(clients_attendant.errors[:ends_at]).to include("must be after starts_at")
      end

      it "is valid when ends_at is nil" do
        clients_attendant.ends_at = nil
        expect(clients_attendant).to be_valid
      end
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
      let!(:past_relationship) do
        create(:clients_attendant, starts_at: 2.days.ago, ends_at: 1.day.ago)
      end

      let!(:future_relationship) do
        create(:clients_attendant, starts_at: 1.day.from_now)
      end

      let!(:current_ended_relationship) do
        create(:clients_attendant, starts_at: 1.day.ago, ends_at: 1.day.from_now)
      end

      let!(:current_ongoing_relationship) do
        create(:clients_attendant, starts_at: 1.day.ago)
      end

      it "includes relationships that started in the past and haven't ended" do
        expect(described_class.current).to include(current_ongoing_relationship)
      end

      it "includes relationships that started in the past and end in the future" do
        expect(described_class.current).to include(current_ended_relationship)
      end

      it "excludes relationships that ended in the past" do
        expect(described_class.current).not_to include(past_relationship)
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
