# == Schema Information
#
# Table name: event_details
#
#  id                :uuid             not null, primary key
#  description       :text
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  address_id        :uuid             not null
#  calendar_event_id :uuid             not null
#
# Indexes
#
#  index_event_details_on_address_id         (address_id)
#  index_event_details_on_calendar_event_id  (calendar_event_id)
#
# Foreign Keys
#
#  fk_rails_...  (address_id => addresses.id)
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#
class EventDetail < ApplicationRecord
  include PgSearchable

  pg_search_config(against: [])

  tracked
  resourcify

  belongs_to :calendar_event, class_name: "Calendar::Event"

  accepts_nested_attributes_for :calendar_event

  scope :includes_associated, -> { includes([]) }
end
