# == Schema Information
#
# Table name: requirement_items
#
#  id               :uuid             not null, primary key
#  credential_type  :integer
#  fulfillable_type :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  fulfillable_id   :uuid
#  requirement_id   :uuid             not null
#
# Indexes
#
#  index_req_items_on_req_credential_type_unique  (requirement_id,credential_type) UNIQUE WHERE (credential_type IS NOT NULL)
#  index_req_items_on_req_fulfillable_unique      (requirement_id,fulfillable_type,fulfillable_id) UNIQUE WHERE (fulfillable_id IS NOT NULL)
#  index_requirement_items_on_fulfillable         (fulfillable_type,fulfillable_id)
#  index_requirement_items_on_requirement_id      (requirement_id)
#
# Foreign Keys
#
#  fk_rails_...  (requirement_id => requirements.id)
#
require "rails_helper"

RSpec.describe Requirement::Item do
  describe "Validations" do
    it "is valid with a training fulfillable" do
      expect(build(:requirement_item)).to be_valid
    end

    it "is valid with a credential type" do
      expect(build(:requirement_item, :credential)).to be_valid
    end

    it "is invalid when a fulfillable is duplicated for the same requirement" do
      requirement = create(:requirement)
      training = create(:training)
      create(:requirement_item, requirement: requirement, fulfillable: training)

      duplicate = build(:requirement_item, requirement: requirement, fulfillable: training)
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:fulfillable_id]).to be_present
    end

    it "rejects unsupported fulfillable types" do
      item = build(:requirement_item, fulfillable_type: "Client", fulfillable_id: SecureRandom.uuid)
      expect(item).not_to be_valid
      expect(item.errors[:fulfillable_type]).to be_present
    end

    it "rejects items with both training and credential" do
      item = build(:requirement_item, credential_type: :cpr)
      expect(item).not_to be_valid
      expect(item.errors[:base]).to be_present
    end

    it "rejects items with neither training nor credential" do
      item = build(:requirement_item, fulfillable: nil, fulfillable_type: nil, fulfillable_id: nil, credential_type: nil)
      expect(item).not_to be_valid
      expect(item.errors[:base]).to be_present
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:requirement).class_name("Requirement::Requirement") }
    it { is_expected.to belong_to(:fulfillable).optional }
  end
end
