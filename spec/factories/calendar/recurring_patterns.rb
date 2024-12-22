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
FactoryBot.define do
  factory :calendar_recurring_pattern, class: "Calendar::RecurringPattern" do
    recurring_type { 1 }
    offset { 1 }
    # separation_count { 1 }
    # max_occurrences { 1 }
    # day_of_week { 1 }
    # week_of_month { 1 }
    # day_of_month { 1 }
    # month_of_year { 1 }

    calendar_event
  end
end
