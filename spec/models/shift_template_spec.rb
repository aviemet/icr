# == Schema Information
#
# Table name: shift_templates
#
#  id            :uuid             not null, primary key
#  active        :boolean          default(FALSE), not null
#  end_date      :date
#  frequency     :integer
#  name          :string
#  start_date    :date
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  client_id     :uuid             not null
#  created_by_id :uuid             not null
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
  describe "validations" do
    it "is valid with valid attributes" do
      template = build(:shift_template)
      expect(template).to be_valid
    end

    it "requires a name" do
      template = build(:shift_template, name: nil)
      expect(template).not_to be_valid
      expect(template.errors[:name]).to include("can't be blank")
    end

    it "requires start_date when recurring" do
      template = build(:shift_template, frequency: :weekly, start_date: nil)
      expect(template).not_to be_valid
      expect(template.errors[:start_date]).to include("can't be blank")
    end

    it "requires end_date when recurring" do
      template = build(:shift_template, frequency: :weekly, end_date: nil)
      expect(template).not_to be_valid
      expect(template.errors[:end_date]).to include("can't be blank")
    end

    it "ensures end_date is after start_date" do
      template = build(:shift_template,
        frequency: :weekly,
        start_date: Date.current,
        end_date: Date.current - 1.day,)
      expect(template).not_to be_valid
      expect(template.errors[:end_date]).to include("must be after start date")
    end
  end

  describe "#duplicate" do
    it "creates a copy of the template with a new name" do
      original = create(:shift_template, name: "Original Template")
      create(:shift_template_entry, shift_template: original)

      copy = original.duplicate

      expect(copy).to be_persisted
      expect(copy.name).to eq("Original Template (Copy)")
      expect(copy.shift_template_entries.count).to eq(1)
      expect(copy.active).to be false
    end
  end

  describe "#check_conflicts" do
    it "returns empty array when no conflicts exist" do
      template = create(:shift_template)
      create(:shift_template_entry,
         shift_template: template,
         start_time: "09:00",
         end_time: "17:00",)
      create(:shift_template_entry,
         shift_template: template,
         start_time: "17:00",
         end_time: "23:00",)

      expect(template.check_conflicts).to be_empty
    end

    it "detects overlapping shifts" do
      template = create(:shift_template)
      entry1 = create(:shift_template_entry,
        shift_template: template,
        start_time: "09:00",
        end_time: "17:00",)
      entry2 = create(:shift_template_entry,
        shift_template: template,
        start_time: "16:00",
        end_time: "23:00",)

      conflicts = template.check_conflicts
      expect(conflicts).to include([entry1, entry2])
    end
  end
end
