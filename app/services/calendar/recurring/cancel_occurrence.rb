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

        ActiveRecord::Base.transaction do
          @event.event_exceptions.create!(cancelled: time)
          SyncOccurrenceApprovals.delete_slot(master_shift, time)
          SyncOccurrenceOverrides.delete_slot(master_shift, time)
        end
      end

      def master_shift
        Shift.find_by(calendar_event_id: @event.id)
      end
    end
  end
end
