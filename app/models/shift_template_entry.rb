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
class ShiftTemplateEntry < ApplicationRecord
  tracked
  resourcify

  belongs_to :shift_template
  belongs_to :employee, optional: true

  validates :day_of_week, presence: true, inclusion: { in: 0..6 }
  validates :starts_at, presence: true
  validates :ends_at, presence: true
  validate :ends_at_after_starts_at

  private

  def ends_at_after_starts_at
    return if ends_at.blank? || starts_at.blank?

    if ends_at <= starts_at
      errors.add(:ends_at, "must be after start time")
    end
  end
end
