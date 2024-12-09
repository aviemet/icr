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
require "models/concerns/shiftable"

RSpec.describe Client, type: :model do
  subject(:client) { build_stubbed(:client) }

  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:client)).to be_valid
    end

    it "is invalid with invalid atributes" do
      expect(build(:client, {
        person: nil
      },)).not_to be_valid
    end
  end

  describe "Associations" do
    it_behaves_like "shiftable"

    it "has a schedule" do

    end
  end
end
