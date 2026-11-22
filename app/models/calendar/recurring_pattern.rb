# == Schema Information
#
# Table name: calendar_recurring_patterns
#
#  id                :uuid             not null, primary key
#  day_of_month      :integer
#  day_of_week       :integer
#  end_date          :date
#  max_occurrences   :integer
#  month_of_year     :integer
#  offset            :integer          default(1), not null
#  recurring_type    :integer          not null
#  week_of_month     :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_event_id :uuid             not null
#
# Indexes
#
#  index_calendar_recurring_patterns_on_calendar_event_id  (calendar_event_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#
class Calendar::RecurringPattern < ApplicationRecord
  enum :recurring_type, {
    daily: 0,
    weekly: 1,
    monthly: 2,
    yearly: 3,
  }

  resourcify

  belongs_to :calendar_event, class_name: "Calendar::Event"

  validates :recurring_type, presence: true
  validates :offset, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :day_of_week, presence: true, inclusion: { in: 0..6 }, if: :weekly?
  validates :day_of_week, inclusion: { in: 0..6 }, allow_nil: true
  validates :day_of_month, inclusion: { in: 1..31 }, allow_nil: true
  validates :week_of_month, inclusion: { in: -1..5 }, allow_nil: true
  validates :month_of_year, inclusion: { in: 1..12 }, allow_nil: true
  validates :max_occurrences, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true

  validate :weekly_has_day
  validate :monthly_has_anchor
  validate :yearly_has_anchor
  validate :end_date_not_before_start, if: -> { end_date.present? }

  private

  def weekly_has_day
    return unless weekly?
    return if day_of_week.present?

    errors.add(:day_of_week, :blank)
  end

  def monthly_has_anchor
    return unless monthly?
    return if day_of_month.present?
    return if week_of_month.present? && day_of_week.present?

    errors.add(:base, :monthly_anchor_required)
  end

  def yearly_has_anchor
    return unless yearly?
    return if month_of_year.present? && day_of_month.present?
    return if month_of_year.present? && week_of_month.present? && day_of_week.present?

    errors.add(:base, :yearly_anchor_required)
  end

  def end_date_not_before_start
    starts_on = calendar_event&.starts_at&.to_date
    return if starts_on.blank?
    return if end_date >= starts_on

    errors.add(:end_date, :before_start)
  end
end
