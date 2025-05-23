# == Schema Information
#
# Table name: calendar_events
#
#  id            :uuid             not null, primary key
#  all_day       :boolean          default(FALSE), not null
#  ends_at       :datetime
#  name          :string
#  starts_at     :datetime
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  created_by_id :uuid
#  parent_id     :uuid
#
# Indexes
#
#  index_calendar_events_on_created_by_id  (created_by_id)
#  index_calendar_events_on_parent_id      (parent_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (parent_id => calendar_events.id)
#
class Calendar::Event < ApplicationRecord
  include PgSearchable
  pg_search_config(against: [:name, :starts_at, :ends_at])

  resourcify

  belongs_to :parent, class_name: "Calendar::Event", optional: true
  belongs_to :created_by, class_name: "User", optional: true

  has_many :recurring_patterns,
    class_name: "Calendar::RecurringPattern",
    foreign_key: "calendar_event_id",
    inverse_of: :calendar_event,
    dependent: :destroy
  has_many :event_participants,
    foreign_key: :calendar_event_id,
    dependent: :destroy,
    inverse_of: :calendar_event
  has_many :clients,
    through: :event_participants,
    source: :participant,
    source_type: "Client"
  has_many :households,
    through: :event_participants,
    source: :participant,
    source_type: "Household"

  has_one :shift,
    foreign_key: "calendar_event_id",
    inverse_of: :calendar_event,
    dependent: :destroy

  before_validation :sanitize_all_day_times

  validates :starts_at, presence: true
  validates :ends_at, presence: true

  validate :starts_at_before_ends_at
  validate :has_name_or_shift

  accepts_nested_attributes_for :shift
  accepts_nested_attributes_for :event_participants

  scope :includes_associated, -> { includes([shift: [employee: [:person]]]) }

  scope :before, ->(time) { where(starts_at: ...time) }
  scope :after, ->(time) { where("ends_at > ?", time) }
  scope :between, ->(start_time, end_time) {
    where("(starts_at < ? AND ends_at > ?) OR (all_day = TRUE AND starts_at < ? AND ends_at > ?)", end_time, start_time, end_time, start_time)
  }
  scope :all_day, ->{ where(all_day: true) }

  private

  def starts_at_before_ends_at
    return if starts_at.blank? || ends_at.blank?

    if starts_at >= ends_at
      errors.add(:ends_at, "End time must be after start time")
    end
  end

  def has_name_or_shift # rubocop:disable Naming/PredicateName
    return unless name.blank? && shift.blank?

    errors.add(:name, "Event must have a title when it's not an employee shift")
  end

  def sanitize_all_day_times
    return unless all_day && starts_at.present?

    self.starts_at = starts_at.beginning_of_day

    self.ends_at = if ends_at.blank? || ends_at.to_date == starts_at.to_date
                     starts_at.end_of_day
                   else
                     ends_at.end_of_day
                   end
  end

end
