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
now = Time.zone.now

FactoryBot.define do
  sequence :start_time do |n|
    Time.zone.local(now.year, now.month, now.day, n + 10)
  end

  sequence :end_time do |n|
    Time.zone.local(now.year, now.month, now.day, n + 11)
  end

  factory :calendar_event do
    starts_at { generate(:start_time) }
    ends_at { generate(:end_time) }

    created_by factory: :user
  end
end
