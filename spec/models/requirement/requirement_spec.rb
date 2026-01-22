# == Schema Information
#
# Table name: requirement_requirements
#
#  id                  :uuid             not null, primary key
#  description         :text
#  name                :string
#  scope_type          :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  requirement_type_id :uuid             not null
#  scope_id            :integer
#
# Indexes
#
#  index_requirement_requirements_on_requirement_type_id  (requirement_type_id)
#
# Foreign Keys
#
#  fk_rails_...  (requirement_type_id => requirement_types.id)
#
require "rails_helper"

RSpec.describe Requirement::Requirement do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:requirement)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(name).each do |attr|
        expect(build(:requirement, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:requirement_type).class_name("Requirement::Type") }
    it { is_expected.to belong_to(:scope).optional }
    it { is_expected.to have_many(:requirement_items).class_name("Requirement::Item").dependent(:destroy) }
    it { is_expected.to have_many(:trainings).through(:requirement_items).source(:fulfillable) }
  end
end
