# == Schema Information
#
# Table name: shift_template_entries
#
#  id                :uuid             not null, primary key
#  day_of_week       :integer
#  ends_at           :time
#  starts_at         :time
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  employee_id       :uuid             not null
#  shift_template_id :uuid             not null
#
# Indexes
#
#  index_shift_template_entries_on_employee_id        (employee_id)
#  index_shift_template_entries_on_shift_template_id  (shift_template_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (shift_template_id => shift_templates.id)
#
require "rails_helper"

RSpec.describe ShiftTemplateEntry, type: :model do
  describe "validations" do
    it "is valid with valid attributes" do
      entry = build(:shift_template_entry)
      expect(entry).to be_valid
    end

    it "requires day_of_week" do
      entry = build(:shift_template_entry, day_of_week: nil)
      expect(entry).not_to be_valid
      expect(entry.errors[:day_of_week]).to include("can't be blank")
    end

    it "validates day_of_week range" do
      entry = build(:shift_template_entry, day_of_week: 7)
      expect(entry).not_to be_valid
      expect(entry.errors[:day_of_week]).to include("is not included in the list")
    end

    it "requires start_time" do
      entry = build(:shift_template_entry, start_time: nil)
      expect(entry).not_to be_valid
      expect(entry.errors[:start_time]).to include("can't be blank")
    end

    it "requires end_time" do
      entry = build(:shift_template_entry, end_time: nil)
      expect(entry).not_to be_valid
      expect(entry.errors[:end_time]).to include("can't be blank")
    end

    it "ensures end_time is after start_time" do
      entry = build(:shift_template_entry,
        start_time: "17:00",
        end_time: "09:00",)
      expect(entry).not_to be_valid
      expect(entry.errors[:end_time]).to include("must be after start time")
    end
  end

  describe "overlap validation" do
    it "prevents overlapping shifts on same day" do
      template = create(:shift_template)
      create(:shift_template_entry,
        shift_template: template,
        day_of_week: 1,
        start_time: "09:00",
        end_time: "17:00",)

      overlapping_entry = build(:shift_template_entry,
        shift_template: template,
        day_of_week: 1,
        start_time: "16:00",
        end_time: "23:00",)

      expect(overlapping_entry).not_to be_valid
      expect(overlapping_entry.errors[:base]).to include("Shift overlaps with existing shifts")
    end

    it "allows non-overlapping shifts on same day" do
      template = create(:shift_template)
      create(:shift_template_entry,
        shift_template: template,
        day_of_week: 1,
        start_time: "09:00",
        end_time: "17:00",)

      non_overlapping_entry = build(:shift_template_entry,
        shift_template: template,
        day_of_week: 1,
        start_time: "17:00",
        end_time: "23:00",)

      expect(non_overlapping_entry).to be_valid
    end

    it "allows overlapping shifts on different days" do
      template = create(:shift_template)
      create(:shift_template_entry,
        shift_template: template,
        day_of_week: 1,
        start_time: "09:00",
        end_time: "17:00",)

      different_day_entry = build(:shift_template_entry,
        shift_template: template,
        day_of_week: 2,
        start_time: "09:00",
        end_time: "17:00",)

      expect(different_day_entry).to be_valid
    end
  end
end
