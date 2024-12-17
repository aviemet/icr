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
class Calendar::RecurringPatternSerializer < ApplicationSerializer
  object_as :recurring_pattern, model: "Calendar::RecurringPattern"

  attributes(
    :recurring_type,
    :offset,
    :max_occurrences,
    :end_date,
    :day_of_week,
    :week_of_month,
    :day_of_month,
    :month_of_year,
  )
end
