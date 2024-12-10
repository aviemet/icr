# == Schema Information
#
# Table name: categories
#
#  id                 :uuid             not null, primary key
#  categorizable_type :string           not null
#  description        :text
#  name               :string
#  slug               :string           not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
# Indexes
#
#  index_categories_on_name_and_categorizable_type  (name,categorizable_type) UNIQUE
#  index_categories_on_slug                         (slug) UNIQUE
#
require 'rails_helper'

RSpec.describe Category do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:category)).to be_valid
    end

    it "is invlalid with missing attributes" do
      %i(categorizable_type).each do |attr|
        expect(build(:category, attr => nil)).not_to be_valid
      end
    end
  end
end
