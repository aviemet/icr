# frozen_string_literal: true

module Calendar
  module Recurring
    class CancelOccurrence
      def self.call(event, occurrence_starts_at:)
        new(event, occurrence_starts_at:).call
      end

      def initialize(event, occurrence_starts_at:)
        @event = event
        @occurrence_starts_at = occurrence_starts_at
      end

      def call
        time = @occurrence_starts_at
        time = Time.zone.parse(time.to_s) unless time.acts_like?(:time)

        @event.event_exceptions.create!(cancelled: time)
      end
    end
  end
end
