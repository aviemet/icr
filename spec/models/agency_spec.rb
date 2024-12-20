# == Schema Information
#
# Table name: agencies
#
#  id         :uuid             not null, primary key
#  name       :string           not null
#  settings   :jsonb
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_agencies_on_slug  (slug) UNIQUE
#
require "rails_helper"

RSpec.describe Agency do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:agency)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(name).each do |attr|
        expect(build(:agency, attr => nil)).not_to be_valid
      end
    end
  end

  # describe "Associations" do
  # end
end
