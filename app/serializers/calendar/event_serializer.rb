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
#  created_by_id :uuid             not null
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
class Calendar::EventSerializer < ApplicationSerializer
  object_as :event, model: "Calendar::Event"

  attributes(
    :name,
    :starts_at,
    :ends_at,
    :parent_id,
    :category_id,
    :created_by_id,
    :created_at,
    :updated_at,
  )

  has_many :recurring_patterns, serializer: Calendar::RecurringPatternSerializer
  has_one :shift, serializer: ShiftSerializer
end
