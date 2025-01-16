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
  validates :start_time, presence: true
  validates :end_time, presence: true
  validate :end_time_after_start_time
  validate :no_overlapping_shifts

  private

  def end_time_after_start_time
    return unless start_time && end_time

    if end_time <= start_time
      errors.add(:end_time, "must be after start time")
    end
  end

  def no_overlapping_shifts
    return unless shift_template && start_time && end_time

    overlapping = shift_template.shift_template_entries
      .where(day_of_week: day_of_week)
      .where.not(id: id)
      .select do |entry|
        (start_time < entry.end_time) && (end_time > entry.start_time)
      end

    if overlapping.any?
      errors.add(:base, "Shift overlaps with existing shifts")
    end
  end
end
