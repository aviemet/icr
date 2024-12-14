module Participantable
  extend ActiveSupport::Concern

  included do
    has_many :event_participants, as: :participant, dependent: :nullify
    has_many :events, through: :event_participants, source: :calendar_event, class_name: 'Calendar::Event'
  end
end
