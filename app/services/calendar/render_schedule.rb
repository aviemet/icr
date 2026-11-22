# frozen_string_literal: true

module Calendar
  class RenderSchedule
    def self.call(events:, range_start:, range_end:, view:)
      new(events:, range_start:, range_end:, view:).call
    end

    def initialize(events:, range_start:, range_end:, view:)
      @events = events
      @range_start = range_start
      @range_end = range_end
      @view = view
    end

    def call
      occurrences = Recurring::ExpandOccurrences.for_events(
        events: @events,
        range_start: @range_start,
        range_end: @range_end,
      )
      rows = occurrences.map { |occurrence| ScheduleOccurrence.new(occurrence.event, occurrence) }
      serializer_class.render(rows)
    end

    private

    def serializer_class
      "Calendar::Events::#{@view.to_s.camelize}Serializer".constantize
    end
  end
end
