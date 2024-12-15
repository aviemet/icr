# == Schema Information
#
# Table name: medications
#
#  id           :uuid             not null, primary key
#  generic_name :string
#  name         :string           not null
#  notes        :text
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
require "rails_helper"

RSpec.describe Medication do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:medication)).to be_valid
    end

    it "is invlalid with missing attributes" do
      %i(name).each do |attr|
        expect(build(:medication, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it{ is_expected.to have_many(:prescriptions) }
  end
end
