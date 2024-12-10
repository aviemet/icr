# == Schema Information
#
# Table name: calendar_events
#
#  id                   :uuid             not null, primary key
#  ends_at              :datetime
#  starts_at            :datetime
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  created_by_id        :uuid             not null
#  parent_id            :uuid
#  recurring_pattern_id :uuid
#
# Indexes
#
#  index_calendar_events_on_created_by_id         (created_by_id)
#  index_calendar_events_on_parent_id             (parent_id)
#  index_calendar_events_on_recurring_pattern_id  (recurring_pattern_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (parent_id => calendar_events.id)
#  fk_rails_...  (recurring_pattern_id => recurring_patterns.id)
#
class CalendarEvent < ApplicationRecord
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

  belongs_to :parent, class_name: "CalendarEvent", optional: true
  belongs_to :recurring_pattern, optional: true, dependent: :destroy

  belongs_to :created_by, class_name: "User", optional: true

  has_many :shifts, dependent: :nullify
  has_many :appointments, dependent: :nullify

  validates :starts_at, presence: true
  validates :ends_at, presence: true
  validate :starts_at_before_ends_at

  scope :includes_associated, -> { includes([:parent, :recurring_pattern]) }

  scope :before, ->(time) { where(starts_at: ...time) }
  scope :after, ->(time) { where("ends_at > ?", time) }
  scope :between, ->(start_time, end_time) { where("starts_at < ? AND ends_at > ?", end_time, start_time)  }

  private

  def starts_at_before_ends_at
    return if starts_at.blank? || ends_at.blank?

    if starts_at >= ends_at
      errors.add(:ends_at, 'End time must be after start time')
    end
  end
end
