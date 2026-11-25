require "rails_helper"

# == Schema Information
#
# Table name: regional_centers
#
#  id         :uuid             not null, primary key
#  active     :boolean          default(TRUE), not null
#  code       :string           not null
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_regional_centers_on_active  (active)
#  index_regional_centers_on_code    (code) UNIQUE
#
RSpec.describe RegionalCenter do
  describe "validations" do
    subject { build(:regional_center) }

    it { is_expected.to be_valid }
    it { is_expected.to validate_presence_of(:code) }
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_uniqueness_of(:code) }
  end

  describe ".active" do
    it "returns only active regional centers" do
      active = create(:regional_center, active: true)
      inactive = create(:regional_center, active: false)

      expect(described_class.active).to include(active)
      expect(described_class.active).not_to include(inactive)
    end
  end
end
