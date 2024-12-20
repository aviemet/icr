# == Schema Information
#
# Table name: websites
#
#  id          :uuid             not null, primary key
#  name        :string
#  url         :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid             not null
#  contact_id  :uuid
#
# Indexes
#
#  index_websites_on_category_id  (category_id)
#  index_websites_on_contact_id   (contact_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (contact_id => contacts.id)
#
require "rails_helper"

RSpec.describe Website do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:website)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(url).each do |attr|
        expect(build(:website, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it_behaves_like "contact_method"
  end
end
