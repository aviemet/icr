# == Schema Information
#
# Table name: shift_templates
#
#  id            :uuid             not null, primary key
#  active        :boolean          default(TRUE), not null
#  end_date      :date
#  frequency     :integer
#  name          :string
#  start_date    :date
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  client_id     :uuid             not null
#  created_by_id :uuid
#
# Indexes
#
#  index_shift_templates_on_client_id      (client_id)
#  index_shift_templates_on_created_by_id  (created_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (created_by_id => users.id)
#
require "rails_helper"

RSpec.describe ShiftTemplate, type: :model do
  let(:client) { create(:client) }

  describe "validations" do
    it "is valid with valid attributes" do
      template = build(:shift_template, client: client)
      expect(template).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(name).each do |attr|
        expect(build(:shift_template, client: client, attr => nil)).not_to be_valid
      end
    end

    it "requires start_date when recurring" do
      template = build(:shift_template, client: client, frequency: :weekly, start_date: nil)
      expect(template).not_to be_valid
    end

    it "requires end_date when recurring" do
      template = build(:shift_template, client: client, frequency: :weekly, end_date: nil)
      expect(template).not_to be_valid
    end

    it "ensures end_date is after start_date" do
      template = build(:shift_template,
        client: client,
        frequency: :weekly,
        start_date: Date.current,
        end_date: Date.current - 1.day,)
      expect(template).not_to be_valid
    end
  end

  describe "#duplicate" do
    it "creates a copy of the template with a new name" do
      original = create(:shift_template, client: client, name: "Original Template")
      create(:shift_template_entry, employee: create(:employee), shift_template: original)

      copy = original.duplicate

      expect(copy).to be_persisted
      expect(copy.name).to eq("Original Template (Copy)")
      expect(copy.shift_template_entries.count).to eq(1)
      expect(copy.active).to be false
    end
  end

  describe "#check_conflicts" do
    it "returns empty array when no conflicts exist" do
      template = create(:shift_template, client: client)
      create(:shift_template_entry,
        employee: create(:employee),
        shift_template: template,
        starts_at: "09:00",
        ends_at: "17:00",)
      create(:shift_template_entry,
        employee: create(:employee),
        shift_template: template,
        starts_at: "17:00",
        ends_at: "23:00",)

      expect(template.check_conflicts).to be_empty
    end

    it "detects overlapping shifts" do
      template = create(:shift_template, client: client)
      entry1 = create(:shift_template_entry,
        employee: create(:employee),
        shift_template: template,
        starts_at: "09:00",
        ends_at: "17:00",)
      entry2 = create(:shift_template_entry,
        employee: create(:employee),
        shift_template: template,
        starts_at: "16:00",
        ends_at: "23:00",)

      conflicts = template.check_conflicts
      expect(conflicts).to include(contain_exactly(entry1, entry2))
    end
  end
end
