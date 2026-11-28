# frozen_string_literal: true

module Payroll
  module WorkIntervalCollectors
    class ScheduledShifts < WorkIntervalCollector
      def intervals_for(pay_period:, employee_ids:, range_start: nil, range_end: nil)
        return [] if employee_ids.empty?

        range_start ||= pay_period.starts_at
        range_end ||= pay_period.ends_at
        shifts = candidate_shifts(range_start, range_end, employee_ids)
        rows = shifts.flat_map { |shift| occurrences_for(shift, range_start, range_end) }
          .sort_by { |row| [row.starts_at, row.id.to_s] }
        Payroll::ShiftOccurrence.preload_approvals!(rows)
        Payroll::ShiftOccurrence.preload_overrides!(rows)
        rows.map { |row| work_interval_for(row) }
      end

      private

      def candidate_shifts(range_start, range_end, employee_ids)
        event_ids = Calendar::Event
          .for_schedule_range(range_start, range_end)
          .select(:id)

        Shift
          .where(employee_id: employee_ids, calendar_event_id: event_ids)
          .includes(:service_type, calendar_event: [:clients, :recurring_patterns, :event_exceptions])
      end

      def occurrences_for(shift, range_start, range_end)
        return [] if shift.calendar_event.blank?

        shift.calendar_event.occurrences_in(range_start, range_end).map do |occurrence|
          Payroll::ShiftOccurrence.new(shift, occurrence)
        end
      end

      def work_interval_for(row)
        slug = row.service_type&.slug
        WorkInterval.new(
          id: row.id,
          employee_id: row.employee_id,
          starts_at: row.starts_at,
          ends_at: row.ends_at,
          category: row.service_type,
          ihss: row.ihss,
          client_ids: row.calendar_event.clients.map(&:id),
          leave_kind: TimeOff::LeaveKind.from_slug(slug),
        )
      end
    end
  end
end
