# frozen_string_literal: true

module Calendar
  module Recurring
    class TruncateSeriesBefore
      def self.call(event, occurrence_starts_at:)
        new(event, occurrence_starts_at:).call
      end

      def initialize(event, occurrence_starts_at:)
        @event = event
        @occurrence_starts_at = occurrence_starts_at
        @occurrence_starts_at = Time.zone.parse(@occurrence_starts_at.to_s) unless @occurrence_starts_at.acts_like?(:time)
      end

      def call
        last_day = @occurrence_starts_at.in_time_zone.to_date - 1.day

        ActiveRecord::Base.transaction do
          @event.recurring_patterns.each do |pattern|
            next_end = if pattern.end_date.present?
                         [pattern.end_date, last_day].min
                       else
                         last_day
                       end

            pattern.update!(
              end_date: next_end,
              max_occurrences: nil,
            )
          end

          SyncOccurrenceApprovals.delete_from(
            master_shift,
            occurrence_starts_at: @occurrence_starts_at,
          )
          SyncOccurrenceOverrides.delete_from(
            master_shift,
            occurrence_starts_at: @occurrence_starts_at,
          )
        end
      end

      def master_shift
        Shift.find_by(calendar_event_id: @event.id)
      end
    end
  end
end
