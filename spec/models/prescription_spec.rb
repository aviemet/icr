# == Schema Information
#
# Table name: prescriptions
#
#  id            :uuid             not null, primary key
#  ends_at       :date
#  starts_at     :date
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  client_id     :uuid             not null
#  doctor_id     :uuid             not null
#  dosage_id     :uuid             not null
#  medication_id :uuid             not null
#
# Indexes
#
#  index_prescriptions_on_client_id      (client_id)
#  index_prescriptions_on_doctor_id      (doctor_id)
#  index_prescriptions_on_dosage_id      (dosage_id)
#  index_prescriptions_on_medication_id  (medication_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (doctor_id => doctors.id)
#  fk_rails_...  (dosage_id => dosages.id)
#  fk_rails_...  (medication_id => medications.id)
#
require "rails_helper"

RSpec.describe Prescription do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:prescription)).to be_valid
    end

    it "is invlalid with missing attributes" do
      %i().each do |attr|
        expect(build(:prescription, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it{ is_expected.to belong_to(:medication) }
    it{ is_expected.to belong_to(:client) }
    it{ is_expected.to belong_to(:doctor) }
    it{ is_expected.to belong_to(:dosage) }
  end

  describe "Scopes" do
    describe "active" do
      it "only returns active prescriptions" do
        client = create(:client)
        active = create(:prescription, :active, { client: })
        create(:prescription, :historical, { client: })

        expect(client.prescriptions.active).to eq([active])
      end
    end

    describe "historical" do
      it "only returns historical prescriptions" do
        client = create(:client)
        create(:prescription, :active, { client: })
        historical = create(:prescription, :historical, { client: })

        expect(client.prescriptions.historical).to eq([historical])
      end
    end
  end
end
