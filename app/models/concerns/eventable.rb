module Eventable
  extend ActiveSupport::Concern

  included do
    belongs_to :calendar_event

    delegate :start_time, :end_time, to: :calendar_event

    def self.between(start_date, end_date)
      joins(:calendar_event).merge(CalendarEvent.between(start_date, end_date))
    end
  end
end
