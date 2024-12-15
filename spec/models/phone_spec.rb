# == Schema Information
#
# Table name: phones
#
#  id          :uuid             not null, primary key
#  extension   :string
#  notes       :text
#  number      :string           not null
#  title       :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid
#  contact_id  :uuid
#
# Indexes
#
#  index_phones_on_category_id  (category_id)
#  index_phones_on_contact_id   (contact_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (contact_id => contacts.id)
#
require "rails_helper"
require "models/shared/contact_method"

RSpec.describe Phone do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:phone)).to be_valid
    end

    it "is invlalid with missing attributes" do
      %i(number).each do |attr|
        expect(build(:phone, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it_behaves_like "contact_method"
  end
end
