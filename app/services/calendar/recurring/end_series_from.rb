# frozen_string_literal: true

module Calendar
  module Recurring
    class EndSeriesFrom
      def self.call(event, occurrence_starts_at:)
        new(event, occurrence_starts_at:).call
      end

      def initialize(event, occurrence_starts_at:)
        @event = event
        @occurrence_starts_at = parse_time(occurrence_starts_at)
      end

      def call
        raise ArgumentError, "occurrence_starts_at is required" if @occurrence_starts_at.blank?
        return :destroy if @event.recurring_patterns.empty?
        return :destroy if same_instant?(@occurrence_starts_at, @event.starts_at)

        TruncateSeriesBefore.call(@event, occurrence_starts_at: @occurrence_starts_at)
        :truncated
      end

      private

      def same_instant?(left, right)
        left.to_i == right.to_i
      end

      def parse_time(value)
        return if value.blank?
        return value if value.acts_like?(:time)

        Time.zone.parse(value.to_s)
      end
    end
  end
end
