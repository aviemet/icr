# == Schema Information
#
# Table name: calendar_entries
#
#  id                            :uuid             not null, primary key
#  ends_at                       :datetime
#  starts_at                     :datetime
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  calendar_recurring_pattern_id :uuid
#  created_by_id                 :uuid             not null
#  parent_id                     :uuid
#
# Indexes
#
#  index_calendar_entries_on_calendar_recurring_pattern_id  (calendar_recurring_pattern_id)
#  index_calendar_entries_on_created_by_id                  (created_by_id)
#  index_calendar_entries_on_parent_id                      (parent_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_recurring_pattern_id => calendar_recurring_patterns.id)
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (parent_id => calendar_entries.id)
#
class Calendar::Entry < ApplicationRecord
  pg_search_scope(
    :search,
    against: [:starts_at, :ends_at],
    associated_against: {
      parent: [],
      recurring_pattern: [],
      created_by: [],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  belongs_to :parent, class_name: 'Calendar::Entry', optional: true
  belongs_to :calendar_recurring_pattern, class_name: 'Calendar::RecurringPattern', optional: true, dependent: :destroy

  belongs_to :created_by, class_name: 'User', optional: true

  has_one :shift, dependent: :nullify, inverse_of: :calendar_entry
  has_one :non_shift_event, dependent: :nullify, inverse_of: :calendar_entry

  validates :starts_at, presence: true
  validates :ends_at, presence: true
  validate :starts_at_before_ends_at

  scope :includes_associated, -> { includes([:parent, :recurring_pattern]) }

  scope :before, ->(time) { where(starts_at: ...time) }
  scope :after, ->(time) { where('ends_at > ?', time) }
  scope :between, ->(start_time, end_time) { where('starts_at < ? AND ends_at > ?', end_time, start_time)  }

  accepts_nested_attributes_for :shift
  accepts_nested_attributes_for :non_shift_event

  validate :exactly_one_association_present

  private

  def starts_at_before_ends_at
    return if starts_at.blank? || ends_at.blank?

    if starts_at >= ends_at
      errors.add(:ends_at, 'End time must be after start time')
    end
  end

  def exactly_one_association_present
    if [shift.present?, non_shift_event.present?].count(true) != 1
      errors.add(:base, "Exactly one of :shift or :non_shift_event must be present")
    end
  end
end
