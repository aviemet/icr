# == Schema Information
#
# Table name: service_types
#
#  id                  :uuid             not null, primary key
#  active              :boolean          default(TRUE), not null
#  allows_multi_client :boolean          default(FALSE), not null
#  assignable          :boolean          default(TRUE), not null
#  billable            :boolean          default(TRUE), not null
#  color               :string           default("#2F6FED"), not null
#  name                :string           not null
#  payable             :boolean          default(TRUE), not null
#  position            :integer          default(0), not null
#  requires_notes      :boolean          default(FALSE), not null
#  slug                :string           not null
#  system              :boolean          default(FALSE), not null
#  tracks_mileage      :boolean          default(FALSE), not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
# Indexes
#
#  index_service_types_on_active    (active)
#  index_service_types_on_name      (name) UNIQUE
#  index_service_types_on_position  (position)
#  index_service_types_on_slug      (slug) UNIQUE
#
require "rails_helper"

RSpec.describe ServiceType, type: :model do
  describe ".assignable" do
    it "includes only assignable service types" do
      assignable = create(:service_type, name: "Assignable #{SecureRandom.hex(4)}", assignable: true)
      excluded = create(:service_type, name: "Leave #{SecureRandom.hex(4)}", assignable: false)

      expect(described_class.assignable).to include(assignable)
      expect(described_class.assignable).not_to include(excluded)
    end
  end

  describe "validations" do
    it "requires a unique name and slug" do
      create(:service_type, name: "Personal Care")
      duplicate = build(:service_type, name: "Personal Care")

      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:name]).to be_present
    end

    it "requires a hex color" do
      service_type = build(:service_type, color: "blue")

      expect(service_type).not_to be_valid
      expect(service_type.errors[:color]).to be_present
    end

    it "allows active types with neither billable nor payable" do
      service_type = build(:service_type, active: true, billable: false, payable: false)

      expect(service_type).to be_valid
    end
  end

  describe "system protection" do
    it "prevents destroying system types" do
      service_type = described_class.find_by(slug: "regular") || create(:service_type, :system)
      service_type.update!(system: true) unless service_type.system?

      expect(service_type.destroy).to be(false)
      expect(described_class.exists?(service_type.id)).to be(true)
    end
  end

  describe ".default" do
    it "prefers the regular active type" do
      create(:service_type, name: "Other Work #{SecureRandom.hex(4)}")
      regular = described_class.find_by(slug: "regular") || create(:service_type, :system)

      expect(described_class.default).to eq(regular)
    end
  end
end
