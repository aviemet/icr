# == Schema Information
#
# Table name: people
#
#  id              :uuid             not null, primary key
#  characteristics :jsonb
#  dob             :date
#  first_name      :string
#  last_name       :string
#  middle_name     :string
#  nick_name       :string
#  slug            :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  user_id         :uuid
#
# Indexes
#
#  index_people_on_slug     (slug) UNIQUE
#  index_people_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require "rails_helper"

RSpec.describe Person do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:person)).to be_valid
    end

    it "is invlalid with missing attributes" do
      %i(first_name last_name).each do |attr|
        expect(build(:person, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it{ is_expected.to belong_to(:user).optional }

    it{ is_expected.to have_one(:client) }
    it{ is_expected.to have_one(:employee) }
    it{ is_expected.to have_one(:doctor) }
  end
end
