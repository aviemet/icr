# == Schema Information
#
# Table name: categories
#
#  id                 :uuid             not null, primary key
#  categorizable_type :string           not null
#  description        :text
#  name               :string           not null
#  slug               :string           not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  parent_id          :uuid
#
# Indexes
#
#  index_categories_on_name_and_categorizable_type  (name,categorizable_type) UNIQUE
#  index_categories_on_parent_id                    (parent_id)
#  index_categories_on_slug                         (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (parent_id => categories.id)
#
require "rails_helper"

RSpec.describe Category do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:category)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(name categorizable_type).each do |attr|
        expect(build(:category, attr => nil)).not_to be_valid
      end
    end

    it "is invalid with invalid categorizable type" do
      expect(build(:category, { categorizable_type: "Invalid"})).not_to be_valid
    end

    it "enforces uniquess of :name across :categorizable_type" do
      name = "Exmample"
      create(:category, { name:, categorizable_type: "Address" })

      expect(build(:category, { name:, categorizable_type: "Address" })).not_to be_valid
      expect(build(:category, { name:, categorizable_type: "Email" })).to be_valid
    end
  end

  describe "Search methods" do
    describe "#records" do
      it "fetches only the records in its category" do
        category_type = "Vendor"
        category = create(:category, { categorizable_type: category_type })
        vendors = create_list(:vendor, 5, { category: })
        other_vendor = create(:vendor)

        expect(category.records).to include(*vendors)
        expect(category.records).not_to include(other_vendor)
      end
    end

    describe "#qty" do
      it "returns the number of records with the category" do
        category_type = "Vendor"
        category = create(:category, { categorizable_type: category_type })
        vendors = create_list(:vendor, 5, { category: })

        expect(category.qty).to eq(vendors.count)
      end
    end

    describe "#type" do
      it "returns the class of the category type" do
        category = build_stubbed(:category, { categorizable_type: "Vendor" })

        expect(category.type).to be(Vendor)
      end
    end

  end

end
