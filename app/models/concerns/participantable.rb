module Participantable
  extend ActiveSupport::Concern

  included do
    has_many :event_participants, as: :participant, dependent: :nullify

    def calendar_events
      Calendar::Event.joins(:shift)
        .where(shifts: { employee_id: self.id })
        .distinct
    end
  end
end
