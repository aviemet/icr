# == Schema Information
#
# Table name: households_clients
#
#  id           :uuid             not null, primary key
#  ends_at      :date
#  starts_at    :date             not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  client_id    :uuid             not null
#  household_id :uuid             not null
#
# Indexes
#
#  index_households_clients_on_client_id         (client_id)
#  index_households_clients_on_household_id      (household_id)
#  index_households_clients_one_open_per_client  (client_id) UNIQUE WHERE (ends_at IS NULL)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (household_id => households.id)
#
require "rails_helper"

RSpec.describe HouseholdsClient do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:households_client)).to be_valid
    end

    it "requires starts_at" do
      membership = build(:households_client)
      membership.starts_at = nil
      expect(membership).not_to be_valid
      expect(membership.errors[:starts_at]).to be_present
    end

    it "rejects ends_at before starts_at" do
      membership = build(:households_client, starts_at: Date.current, ends_at: Date.yesterday)
      expect(membership).not_to be_valid
      expect(membership.errors[:ends_at]).to be_present
    end

    it "rejects a second open membership for the same client" do
      client = create(:client)
      create(:households_client, client: client, starts_at: Date.current)

      duplicate = build(:households_client, client: client, starts_at: Date.current)
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:client_id]).to be_present
    end

    it "rejects overlapping dated memberships for the same client" do
      client = create(:client)
      create(
        :households_client,
        client: client,
        starts_at: 30.days.ago.to_date,
        ends_at: 10.days.ago.to_date,
      )

      overlapping = build(
        :households_client,
        client: client,
        starts_at: 15.days.ago.to_date,
        ends_at: 5.days.ago.to_date,
      )
      expect(overlapping).not_to be_valid
      expect(overlapping.errors[:base]).to be_present
    end

    it "allows a new membership after a prior one ended" do
      client = create(:client)
      create(
        :households_client,
        client: client,
        starts_at: 30.days.ago.to_date,
        ends_at: 10.days.ago.to_date,
      )

      next_membership = build(
        :households_client,
        client: client,
        starts_at: 5.days.ago.to_date,
      )
      expect(next_membership).to be_valid
    end
  end

  describe "scopes" do
    it "current includes open and not-yet-ended memberships" do
      current = create(:households_client, starts_at: Date.current)
      ending_today = create(:households_client, starts_at: 5.days.ago.to_date, ends_at: Date.current)
      historical = create(:households_client, :ended)

      expect(described_class.current).to include(current, ending_today)
      expect(described_class.current).not_to include(historical)
    end

    it "historical includes ended memberships" do
      historical = create(:households_client, :ended)
      current = create(:households_client)

      expect(described_class.historical).to include(historical)
      expect(described_class.historical).not_to include(current)
    end

    it "overlapping selects memberships that intersect a date range" do
      inside = create(
        :households_client,
        starts_at: Date.new(2026, 1, 1),
        ends_at: Date.new(2026, 1, 31),
      )
      outside = create(
        :households_client,
        starts_at: Date.new(2025, 1, 1),
        ends_at: Date.new(2025, 1, 31),
      )

      range = described_class.overlapping(Date.new(2026, 1, 10), Date.new(2026, 1, 20))
      expect(range).to include(inside)
      expect(range).not_to include(outside)
    end
  end

  describe "#covers?" do
    it "is true on membership days and false outside" do
      membership = build(
        :households_client,
        starts_at: Date.new(2026, 1, 10),
        ends_at: Date.new(2026, 1, 20),
      )

      expect(membership.covers?(Date.new(2026, 1, 10))).to be(true)
      expect(membership.covers?(Date.new(2026, 1, 20))).to be(true)
      expect(membership.covers?(Date.new(2026, 1, 9))).to be(false)
      expect(membership.covers?(Date.new(2026, 1, 21))).to be(false)
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:client) }
    it { is_expected.to belong_to(:household) }
  end
end
