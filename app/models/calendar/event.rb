# == Schema Information
#
# Table name: calendar_events
#
#  id            :uuid             not null, primary key
#  ends_at       :datetime
#  name          :string           not null
#  starts_at     :datetime
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  category_id   :uuid
#  created_by_id :uuid             not null
#  employee_id   :uuid
#  parent_id     :uuid
#
# Indexes
#
#  index_calendar_events_on_category_id    (category_id)
#  index_calendar_events_on_created_by_id  (created_by_id)
#  index_calendar_events_on_employee_id    (employee_id)
#  index_calendar_events_on_parent_id      (parent_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (parent_id => calendar_events.id)
#
class Calendar::Event < ApplicationRecord
  include Categorizable

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

  belongs_to :parent, class_name: "Calendar::Event", optional: true
  belongs_to :employee, optional: true
  belongs_to :created_by, class_name: "User", optional: true

  has_many :event_participants, as: :event, dependent: :nullify
  has_many :clients, through: :event_participants, source: :participant, source_type: "Client"
  has_many :households, through: :event_participants, source: :participant, source_type: "Household"
  has_many :recurring_patterns, class_name: "Calendar::RecurringPattern", foreign_key: "calendar_event_id", inverse_of: :calendar_event, dependent: :destroy

  validates :name, presence: true
  validates :starts_at, presence: true
  validates :ends_at, presence: true
  validate :starts_at_before_ends_at

  scope :includes_associated, -> { includes([:parent, :recurring_patterns, :event_participants, :clients, :households]) }

  scope :before, ->(time) { where(starts_at: ...time) }
  scope :after, ->(time) { where("ends_at > ?", time) }
  scope :between, ->(start_time, end_time) { where("starts_at < ? AND ends_at > ?", end_time, start_time)  }

  private

  def starts_at_before_ends_at
    return if starts_at.blank? || ends_at.blank?

    if starts_at >= ends_at
      errors.add(:ends_at, "End time must be after start time")
    end
  end
end
