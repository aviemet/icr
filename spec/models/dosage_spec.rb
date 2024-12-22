# == Schema Information
#
# Table name: dosages
#
#  id          :uuid             not null, primary key
#  amount      :decimal(, )
#  amount_unit :integer
#  freq_amount :decimal(, )
#  freq_period :integer
#  notes       :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
require "rails_helper"

RSpec.describe Dosage do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:dosage)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(amount freq_period).each do |attr|
        expect(build(:dosage, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it{ is_expected.to have_one(:prescription) }
  end
end
