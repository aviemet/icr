module Participantable
  extend ActiveSupport::Concern

  included do
    has_many :event_participants, as: :participant, dependent: :nullify

    def between(start_date, end_date)
      shifts_within_range = shifts.between(start_date, end_date)
      appointments_within_range = appointments.between(start_date, end_date)
      (shifts_within_range + appointments_within_range).uniq
    end
  end
end
