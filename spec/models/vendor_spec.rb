# == Schema Information
#
# Table name: vendors
#
#  id          :uuid             not null, primary key
#  name        :string           not null
#  notes       :text
#  slug        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid
#
# Indexes
#
#  index_vendors_on_category_id  (category_id)
#  index_vendors_on_slug         (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#
require 'rails_helper'

RSpec.describe Vendor do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:vendor)).to be_valid
    end

    it 'is invlalid with missing attributes' do
      %i(name).each do |attr|
        expect(build(:vendor, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it{ is_expected.to belong_to(:category) }
  end
end
