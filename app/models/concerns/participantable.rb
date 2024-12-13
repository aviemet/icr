module Participantable
  extend ActiveSupport::Concern

  included do
    has_many :event_participants, as: :participant, dependent: :nullify

    has_many :events, through: :event_participants, source: :event, source_type: 'Calendar::Event'

    def shifts
      events.where(category: Categry.find_by(slug: 'event-shift'))
    end

    def between(start_date, end_date)
      shifts_within_range = shifts.between(start_date, end_date)
      events_within_range = non_shift_events.between(start_date, end_date)
      (shifts_within_range + events_within_range).uniq
    end
  end
end
