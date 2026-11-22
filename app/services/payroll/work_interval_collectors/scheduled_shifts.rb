# frozen_string_literal: true

module Payroll
  module WorkIntervalCollectors
    class ScheduledShifts < WorkIntervalCollector
      def intervals_for(pay_period:, employee_ids:)
        return [] if employee_ids.empty?

        shift_records = candidate_shifts(pay_period, employee_ids)
        shift_records.flat_map do |shift|
          intervals_for_shift(shift, pay_period)
        end
      end

      private

      def candidate_shifts(pay_period, employee_ids)
        event_ids = Calendar::Event
          .for_schedule_range(pay_period.starts_at, pay_period.ends_at)
          .select(:id)

        Shift
          .where(employee_id: employee_ids, calendar_event_id: event_ids)
          .includes(:category, calendar_event: [:clients, :recurring_patterns, :event_exceptions])
      end

      def intervals_for_shift(shift, pay_period)
        event = shift.calendar_event
        return [] if event.blank?

        Calendar::Recurring::ExpandOccurrences
          .call(event:, range_start: pay_period.starts_at, range_end: pay_period.ends_at)
          .map { |occurrence| work_interval_for(shift, occurrence) }
      end

      def work_interval_for(shift, occurrence)
        WorkInterval.new(
          id: interval_id(shift, occurrence),
          employee_id: shift.employee_id,
          starts_at: occurrence.starts_at,
          ends_at: occurrence.ends_at,
          category: shift.category,
          ihss: shift.ihss,
          client_ids: occurrence.event.clients.map(&:id),
        )
      end

      def interval_id(shift, occurrence)
        return shift.id unless occurrence.recurring

        "#{shift.id}:#{occurrence.original_starts_at.utc.iso8601(3)}"
      end
    end
  end
end
