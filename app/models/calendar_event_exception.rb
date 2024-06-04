# == Schema Information
#
# Table name: calendar_event_exceptions
#
#  id                :bigint           not null, primary key
#  cancelled         :datetime
#  ends_at           :datetime
#  rescheduled       :datetime
#  starts_at         :datetime
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_event_id :bigint           not null
#
# Indexes
#
#  index_calendar_event_exceptions_on_calendar_event_id  (calendar_event_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#
class CalendarEventException < ApplicationRecord

  pg_search_scope(
    :search,
    against: [:calendar_event, :rescheduled, :cancelled, :starts_at, :ends_at],
    associated_against: {
      calendar_event: [],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  belongs_to :calendar_event

  scope :includes_associated, -> { includes([:calendar_event]) }
end
