# == Schema Information
#
# Table name: calendar_events
#
#  id          :uuid             not null, primary key
#  all_day     :boolean          default(FALSE), not null
#  ends_at     :datetime
#  name        :string
#  starts_at   :datetime
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid             not null
#  parent_id   :uuid
#
# Indexes
#
#  index_calendar_events_on_category_id  (category_id)
#  index_calendar_events_on_parent_id    (parent_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (parent_id => calendar_events.id)
#
class Calendar::Event < ApplicationRecord
  include PgSearchable

  pg_search_config(against: [:name, :starts_at, :ends_at])

  resourcify

  belongs_to :parent, class_name: "Calendar::Event", optional: true

  has_many :children,
    class_name: "Calendar::Event",
    foreign_key: :parent_id,
    inverse_of: :parent,
    dependent: :destroy
  has_many :recurring_patterns,
    class_name: "Calendar::RecurringPattern",
    foreign_key: "calendar_event_id",
    inverse_of: :calendar_event,
    dependent: :destroy
  has_many :event_exceptions,
    class_name: "Calendar::EventException",
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

  has_one :event_detail,
  foreign_key: "calendar_event_id",
  inverse_of: :calendar_event,
  dependent: :destroy

  before_validation :sanitize_all_day_times
  before_validation :set_shift_category_when_shift_present
  before_destroy :prevent_destroy_when_pay_period_finalized, prepend: true
  after_commit :invalidate_shift_approvals_on_time_change, on: :update

  validates :starts_at, presence: true
  validates :ends_at, presence: true

  validate :starts_at_before_ends_at
  validate :has_name_or_shift
  validate :pay_period_allows_mutation

  accepts_nested_attributes_for :shift
  accepts_nested_attributes_for :event_participants
  accepts_nested_attributes_for :recurring_patterns

  scope :includes_associated, -> { includes([shift: [employee: [:person]]]) }

  scope :before, ->(time) { where(starts_at: ...time) }
  scope :after, ->(time) { where("ends_at > ?", time) }
  scope :between, ->(start_time, end_time) {
    where("(starts_at < ? AND ends_at > ?) OR (all_day = TRUE AND starts_at < ? AND ends_at > ?)", end_time, start_time, end_time, start_time)
  }
  scope :all_day, ->{ where(all_day: true) }
  scope :schedule_masters, -> { where(parent_id: nil) }

  scope :for_schedule_range, ->(range_start, range_end) {
    non_recurring_ids = schedule_masters
      .left_outer_joins(:recurring_patterns)
      .where(calendar_recurring_patterns: { id: nil })
      .where(
        <<~SQL.squish,
          (calendar_events.starts_at < :range_end AND calendar_events.ends_at > :range_start)
          OR (calendar_events.all_day = TRUE AND calendar_events.starts_at < :range_end AND calendar_events.ends_at > :range_start)
        SQL
        range_start: range_start,
        range_end: range_end,
      )
      .reselect("calendar_events.id")

    recurring_ids = schedule_masters
      .joins(:recurring_patterns)
      .where(calendar_events: { starts_at: ...range_end })
      .where(
        "calendar_recurring_patterns.end_date IS NULL OR calendar_recurring_patterns.end_date >= ?",
        range_start.to_date,
      )
      .reselect("calendar_events.id")

    where(id: non_recurring_ids).or(where(id: recurring_ids))
  }

  scope :with_schedule_association_preloads, -> {
    includes([
      :recurring_patterns,
      :event_exceptions,
      :event_participants,
      {
        clients: [
          :calendar_customization,
          { person: [:employee, :client, :user] },
        ],
        shift: [
          :category,
          {
            employee: [
              :person,
              :job_title,
              :calendar_customization,
              { person: { contact: { addresses: :category, emails: :category, phones: :category } } },
            ],
          },
        ],
      },
    ])
  }

  private

  def starts_at_before_ends_at
    return if starts_at.blank? || ends_at.blank?

    if starts_at >= ends_at
      errors.add(:ends_at, "End time must be after start time")
    end
  end

  def has_name_or_shift # rubocop:disable Naming/PredicatePrefix
    return unless name.blank? && shift.blank?

    errors.add(:name, "Event must have a title when it's not an employee shift")
  end

  def pay_period_allows_mutation
    if shift&.timesheet&.pay_period&.finalized?
      errors.add(:base, I18n.t("pay_periods.finalized_locked"))
      return
    end

    return if starts_at.blank?
    return if shift.blank?

    period_start_date, = Payroll::Period.period_dates(starts_at.to_date)
    period = PayPeriod.where(starts_at: period_start_date.to_time.beginning_of_day.all_day).first
    return unless period&.finalized?

    errors.add(:base, I18n.t("pay_periods.finalized_locked"))
  end

  def prevent_destroy_when_pay_period_finalized
    return unless shift&.timesheet&.pay_period&.finalized?

    errors.add(:base, I18n.t("pay_periods.finalized_locked"))
    throw :abort
  end

  def set_shift_category_when_shift_present
    return if category_id.present? || shift.blank?

    self.category_id = Category.type("Calendar::Event").find_by!(name: "Shift").id
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

  def invalidate_shift_approvals_on_time_change
    return unless previous_changes.key?("starts_at") || previous_changes.key?("ends_at")

    Shift.find_by(calendar_event_id: id)&.invalidate_approvals!
  end

end
