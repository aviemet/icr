# == Schema Information
#
# Table name: incident_types
#
#  id          :uuid             not null, primary key
#  name        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid
#
# Indexes
#
#  index_incident_types_on_category_id  (category_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#
require 'rails_helper'

RSpec.describe IncidentType do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:incident_type)).to be_valid
    end

    it 'is invlalid with missing attributes' do
      %i(name).each do |attr|
        expect(build(:incident_type, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it{ is_expected.to belong_to(:category) }
  end
end
