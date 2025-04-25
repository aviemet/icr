# == Schema Information
#
# Table name: emails
#
#  id          :uuid             not null, primary key
#  email       :string           not null
#  name        :string
#  notes       :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid             not null
#  contact_id  :uuid
#
# Indexes
#
#  index_emails_on_category_id  (category_id)
#  index_emails_on_contact_id   (contact_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (contact_id => contacts.id)
#
require "rails_helper"
require "models/shared/contact_method"

RSpec.describe Contact::Email do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:email)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(email).each do |attr|
        expect(build(:email, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it_behaves_like "contact_method"
  end
end
