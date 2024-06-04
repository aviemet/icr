# == Schema Information
#
# Table name: calendar_events
#
#  id                   :bigint           not null, primary key
#  ends_at              :datetime
#  schedulable_type     :string
#  starts_at            :datetime
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  created_by_id        :bigint           not null
#  parent_id            :bigint
#  recurring_pattern_id :bigint
#  schedulable_id       :bigint
#
# Indexes
#
#  index_calendar_events_on_created_by_id         (created_by_id)
#  index_calendar_events_on_parent_id             (parent_id)
#  index_calendar_events_on_recurring_pattern_id  (recurring_pattern_id)
#  index_calendar_events_on_schedulable           (schedulable_type,schedulable_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (parent_id => calendar_events.id)
#  fk_rails_...  (recurring_pattern_id => recurring_patterns.id)
#
class CalendarEventSerializer < ApplicationSerializer
  object_as :calendar_event

  attributes(
    :starts_at,
    :ends_at,
    :parent_id,
    :recurring_pattern_id,
    :created_by_id,
    :schedulable_type,
    :schedulable_id,
  )
end
