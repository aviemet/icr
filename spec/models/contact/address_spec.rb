# == Schema Information
#
# Table name: addresses
#
#  id          :uuid             not null, primary key
#  address     :string           not null
#  address_2   :string
#  city        :string
#  country     :integer
#  name        :string
#  notes       :text
#  postal      :string
#  region      :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid             not null
#  contact_id  :uuid
#
# Indexes
#
#  index_addresses_on_category_id  (category_id)
#  index_addresses_on_contact_id   (contact_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (contact_id => contacts.id)
#
require "rails_helper"
require "models/shared/contact_method"

RSpec.describe Contact::Address do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:address)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(address).each do |attr|
        expect(build(:address, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it_behaves_like "contact_method"
  end
end
