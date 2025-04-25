# == Schema Information
#
# Table name: identifications
#
#  id                      :uuid             not null, primary key
#  expires_at              :date
#  extra_fields            :jsonb
#  id_type                 :integer
#  identificationable_type :string           not null
#  issued_at               :date
#  notes                   :text
#  number                  :string
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

    it "is invalid without a number" do
      expect(build(:identification, number: nil)).not_to be_valid
    end

    it "is invalid without a type" do
      expect(build(:identification, id_type: nil)).not_to be_valid
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:identificationable) }
  end

  describe "Enums" do
    it { expect(subject).to define_enum_for(:id_type).with_values(
      drivers_license: 0,
      passport: 1,
      state_id: 2,
      military_id: 3,
      employee_id: 4,
      other: 5,
    ).backed_by_column_of_type(:integer) }
  end

  describe "Scopes" do
    let!(:category) { create(:category, :identification) }
    let!(:expired_id) { create(:identification, category: category, expires_at: 1.day.ago) }
    let!(:active_id) { create(:identification, category: category, expires_at: 2.months.from_now) }
    let!(:never_expires) { create(:identification, category: category, expires_at: nil) }
    let!(:expiring_soon) { create(:identification, category: category, expires_at: 2.weeks.from_now) }

    describe ".expired" do
      it "includes expired identifications" do
        expect(described_class.expired).to include(expired_id)
      end

      it "excludes active identifications" do
        expect(described_class.expired).not_to include(active_id, never_expires)
      end
    end

    describe ".active" do
      it "includes active and never-expiring identifications" do
        expect(described_class.active).to include(active_id, never_expires)
      end

      it "excludes expired identifications" do
        expect(described_class.active).not_to include(expired_id)
      end
    end

    describe ".expiring_soon" do
      it "includes identifications expiring within 30 days" do
        expect(described_class.expiring_soon).to include(expiring_soon)
      end

      it "excludes expired and far-future identifications" do
        expect(described_class.expiring_soon).not_to include(expired_id, active_id)
      end
    end
  end

  describe "Instance Methods" do
    describe "#expired?" do
      it "returns true for expired identifications" do
        identification = build(:identification, expires_at: 1.day.ago)
        expect(identification).to be_expired
      end

      it "returns false for active identifications" do
        identification = build(:identification, expires_at: 1.day.from_now)
        expect(identification).not_to be_expired
      end

      it "returns false for never-expiring identifications" do
        identification = build(:identification, expires_at: nil)
        expect(identification).not_to be_expired
      end
    end

    describe "#active?" do
      it "returns false for expired identifications" do
        identification = build(:identification, expires_at: 1.day.ago)
        expect(identification).not_to be_active
      end

      it "returns true for active identifications" do
        identification = build(:identification, expires_at: 1.day.from_now)
        expect(identification).to be_active
      end

      it "returns true for never-expiring identifications" do
        identification = build(:identification, expires_at: nil)
        expect(identification).to be_active
      end
    end
  end
end
