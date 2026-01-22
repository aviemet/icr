# == Schema Information
#
# Table name: requirement_items
#
#  id               :uuid             not null, primary key
#  fulfillable_type :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  fulfillable_id   :uuid             not null
#  requirement_id   :uuid             not null
#
# Indexes
#
#  index_req_items_on_req_fulfillable_unique  (requirement_id,fulfillable_type,fulfillable_id) UNIQUE
#  index_requirement_items_on_fulfillable     (fulfillable_type,fulfillable_id)
#  index_requirement_items_on_requirement_id  (requirement_id)
#
# Foreign Keys
#
#  fk_rails_...  (requirement_id => requirements.id)
#
require "rails_helper"

RSpec.describe Requirement::Item do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:requirement_item)).to be_valid
    end

    it "is invalid when a fulfillable is duplicated for the same requirement" do
      requirement = create(:requirement)
      training = create(:training)
      create(:requirement_item, requirement: requirement, fulfillable: training)

      duplicate = build(:requirement_item, requirement: requirement, fulfillable: training)
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:fulfillable_id]).to be_present
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:requirement).class_name("Requirement::Requirement") }
    it { is_expected.to belong_to(:fulfillable) }
  end
end
