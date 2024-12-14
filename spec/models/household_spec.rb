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

    it 'is invlalid with missing attributes' do
      %i(name).each do |attr|
        expect(build(:household, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it{ is_expected.to have_many(:clients).through(:households_clients) }
  end
end
