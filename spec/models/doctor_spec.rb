# == Schema Information
#
# Table name: doctors
#
#  id         :uuid             not null, primary key
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  person_id  :uuid             not null
#
# Indexes
#
#  index_doctors_on_person_id  (person_id)
#  index_doctors_on_slug       (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
require "rails_helper"
require "models/shared/participantable"

RSpec.describe Doctor do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:doctor)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(person).each do |attr|
        expect(build(:doctor, attr => nil)).not_to be_valid
      end
    end

  end

  describe "Associations" do
    it_behaves_like "participantable"

    it{ is_expected.to belong_to(:person) }

    it{ is_expected.to have_many(:clients).through(:doctors_clients) }
    it{ is_expected.to have_many(:prescriptions) }
  end
end
