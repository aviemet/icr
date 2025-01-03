module Participantable
  extend ActiveSupport::Concern

  included do
    has_many :event_participants, as: :participant, dependent: :nullify
    has_many :calendar_events, through: :event_participants, class_name: "Calendar::Event"
  end
end
