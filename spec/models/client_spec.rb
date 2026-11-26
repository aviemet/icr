# == Schema Information
#
# Table name: clients
#
#  id                    :uuid             not null, primary key
#  active_at             :date
#  color                 :string
#  communication_notes   :text
#  ihss_authorized_hours :decimal(8, 2)
#  ihss_notes            :text
#  ihss_share_of_cost    :decimal(10, 2)
#  inactive_at           :date
#  ipp_ends_on           :date
#  ipp_review_on         :date
#  ipp_starts_on         :date
#  medi_cal_number       :string
#  number                :string
#  preferred_hospital    :string
#  preferred_language    :string
#  referred_by_other     :string
#  slug                  :string           not null
#  uci_number            :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  person_id             :uuid             not null
#  regional_center_id    :uuid
#
# Indexes
#
#  index_clients_on_person_id           (person_id)
#  index_clients_on_regional_center_id  (regional_center_id)
#  index_clients_on_slug                (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#  fk_rails_...  (regional_center_id => regional_centers.id)
#
require "rails_helper"
require "models/shared/participantable"

RSpec.describe Client do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:client)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(person).each do |attr|
        expect(build(:client, attr => nil)).not_to be_valid
      end
    end

    it "rejects both regional center and referred_by_other" do
      client = build(
        :client,
        regional_center: create(:regional_center),
        referred_by_other: "Privately funded",
      )

      expect(client).not_to be_valid
      expect(client.errors[:base]).to be_present
    end
  end

  describe "#referral_label" do
    it "returns the regional center name when present" do
      regional_center = create(:regional_center, name: "Regional Center of the East Bay")
      client = build(:client, regional_center:, referred_by_other: nil)

      expect(client.referral_label).to eq("Regional Center of the East Bay")
    end

    it "returns referred_by_other when no regional center" do
      client = build(:client, regional_center: nil, referred_by_other: "Privately funded")

      expect(client.referral_label).to eq("Privately funded")
    end
  end

  describe "Associations" do
    it_behaves_like "participantable"

    it{ is_expected.to belong_to(:regional_center).optional }

    it{ is_expected.to have_many(:doctors).through(:doctors_clients) }
    it{ is_expected.to have_many(:hospital_visits).class_name("Client::HospitalVisit") }

    it{ is_expected.to have_one(:household).through(:current_households_client) }
  end
end
