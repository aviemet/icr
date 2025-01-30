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
  let(:employee) { create(:employee) }

  describe "validations" do
    it "is valid with valid attributes" do
      entry = build(:shift_template_entry, employee: employee)
      expect(entry).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(day_of_week starts_at ends_at).each do |attr|
        expect(build(:shift_template_entry, employee: employee, attr => nil)).not_to be_valid
      end
    end

    it "validates day_of_week range" do
      entry = build(:shift_template_entry, employee: employee, day_of_week: 7)
      expect(entry).not_to be_valid
    end

    it "ensures ends_at is after starts_at" do
      entry = build(:shift_template_entry,
        employee: employee,
        starts_at: "17:00",
        ends_at: "09:00",)
      expect(entry).not_to be_valid
    end
  end

end
