require "rails_helper"

# == Schema Information
#
# Table name: client_allergies
#
#  id         :uuid             not null, primary key
#  active     :boolean          default(TRUE), not null
#  name       :string           not null
#  notes      :text
#  reaction   :string
#  severity   :integer          default("mild"), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  client_id  :uuid             not null
#
# Indexes
#
#  index_client_allergies_on_client_id  (client_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#
RSpec.describe Client::Allergy, type: :model do
  it "belongs to a client and requires a name" do
    allergy = build(:client_allergy, name: nil)
    expect(allergy).not_to be_valid
    expect(allergy.errors[:name]).to be_present
  end

  it "exposes severity enums" do
    allergy = create(:client_allergy, severity: :severe)
    expect(allergy.severity_severe?).to be(true)
  end
end
