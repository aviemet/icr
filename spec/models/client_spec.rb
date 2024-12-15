# == Schema Information
#
# Table name: clients
#
#  id          :uuid             not null, primary key
#  active_at   :date
#  color       :string
#  inactive_at :date
#  number      :string
#  slug        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  person_id   :uuid             not null
#
# Indexes
#
#  index_clients_on_person_id  (person_id)
#  index_clients_on_slug       (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
require 'rails_helper'
require "models/shared/shiftable"

RSpec.describe Client do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:client)).to be_valid
    end

    it 'is invlalid with missing attributes' do
      %i(person).each do |attr|
        expect(build(:client, attr => nil)).not_to be_valid
      end
    end

  end

  describe "Associations" do
    it_behaves_like "shiftable"

    it{ is_expected.to belong_to(:person) }

    it{ is_expected.to have_many(:doctors).through(:doctors_clients) }
    it{ is_expected.to have_many(:prescriptions) }

    it{ is_expected.to have_one(:household).through(:households_client) }
  end
end
