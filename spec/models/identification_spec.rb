# == Schema Information
#
# Table name: identifications
#
#  id                      :uuid             not null, primary key
#  expires_at              :date
#  extra_fields            :jsonb
#  identificationable_type :string           not null
#  issued_at               :date
#  notes                   :text
#  number                  :integer
#  type                    :integer
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  category_id             :uuid             not null
#  identificationable_id   :uuid             not null
#
# Indexes
#
#  index_identifications_on_category_id         (category_id)
#  index_identifications_on_identificationable  (identificationable_type,identificationable_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#
require "rails_helper"

RSpec.describe Identification do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:identification)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i().each do |attr|
        expect(build(:identification, attr => nil)).not_to be_valid
      end
    end
  end

  # describe "Associations" do
  #   it{ is_expected.to belong_to(:identificationable) }
  # end
end
