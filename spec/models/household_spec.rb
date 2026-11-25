# == Schema Information
#
# Table name: households
#
#  id         :uuid             not null, primary key
#  name       :string           not null
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_households_on_slug  (slug) UNIQUE
#
require "rails_helper"

RSpec.describe Household do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:household)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(name).each do |attr|
        expect(build(:household, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it { is_expected.to have_many(:clients).through(:current_households_clients) }
    it { is_expected.to have_many(:current_memberships) }
    it { is_expected.to have_many(:past_memberships) }
  end

  describe "#clients" do
    it "returns only current members" do
      household = create(:household)
      current_client = create(:client)
      former_client = create(:client)
      create(:households_client, household: household, client: current_client)
      create(
        :households_client,
        household: household,
        client: former_client,
        starts_at: 30.days.ago.to_date,
        ends_at: 1.day.ago.to_date,
      )

      expect(household.clients).to include(current_client)
      expect(household.clients).not_to include(former_client)
    end
  end
end
