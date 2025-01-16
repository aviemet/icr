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
class ShiftTemplate < ApplicationRecord
  tracked
  resourcify

  belongs_to :client
  belongs_to :created_by, class_name: "User", optional: true

  has_many :shift_template_entries, dependent: :destroy

  enum :frequency, { weekly: 0, biweekly: 1, monthly: 2 }

  validates :name, presence: true
  validates :start_date, presence: true, if: :recurring?
  validates :end_date, presence: true, if: :recurring?
  validates :frequency, presence: true, if: :recurring?
  validate :end_date_after_start_date, if: :recurring?

  def duplicate
    new_template = self.dup
    new_template.name = "#{name} (Copy)"
    new_template.active = false # Don't automatically activate recurring duplicates

    return false unless new_template.save

    shift_template_entries.each do |entry|
      new_entry = entry.dup
      new_entry.shift_template = new_template
      new_entry.save
    end

    new_template
  end

  def check_conflicts
    entries_by_day = shift_template_entries.group_by(&:day_of_week)

    conflicts = []
    entries_by_day.each do |_day, entries|
      entries.combination(2).each do |entry1, entry2|
        if entries_overlap?(entry1, entry2)
          conflicts << [entry1, entry2]
        end
      end
    end

    conflicts
  end

  def recurring?
    frequency.present?
  end

  private

  def entries_overlap?(entry1, entry2)
    (entry1.start_time < entry2.end_time) && (entry1.end_time > entry2.start_time)
  end

  def end_date_after_start_date
    return unless start_date && end_date

    if end_date <= start_date
      errors.add(:end_date, "must be after start date")
    end
  end
end
