# == Schema Information
#
# Table name: event_participants
#
#  id                :uuid             not null, primary key
#  participant_type  :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_event_id :uuid             not null
#  participant_id    :uuid             not null
#
# Indexes
#
#  index_event_participants_on_calendar_event_id  (calendar_event_id)
#  index_event_participants_on_participant        (participant_type,participant_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#
class EventParticipant < ApplicationRecord
  resourcify

  belongs_to :calendar_event, class_name: "Calendar::Event"
  belongs_to :participant, polymorphic: true
end
