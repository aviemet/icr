# == Schema Information
#
# Table name: calendar_recurring_patterns
#
#  id                :uuid             not null, primary key
#  day_of_month      :integer
#  day_of_week       :integer
#  end_date          :integer
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
  validates :offset, presence: true
end
