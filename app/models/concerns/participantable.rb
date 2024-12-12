module Participantable
  extend ActiveSupport::Concern

  included do
    has_many :event_participants, as: :participant, dependent: :nullify

    def between(start_date, end_date)
      shifts_within_range = shifts.between(start_date, end_date)
      events_within_range = non_shift_events.between(start_date, end_date)
      (shifts_within_range + events_within_range).uniq
    end
  end
end
