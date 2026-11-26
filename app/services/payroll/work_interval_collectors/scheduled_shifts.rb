# frozen_string_literal: true

module Payroll
  module WorkIntervalCollectors
    class ScheduledShifts < WorkIntervalCollector
      def intervals_for(pay_period:, employee_ids:)
        return [] if employee_ids.empty?

        pay_period.shift_occurrences(candidate_shifts(pay_period, employee_ids)).map do |row|
          work_interval_for(row)
        end
      end

      private

      def candidate_shifts(pay_period, employee_ids)
        event_ids = Calendar::Event
          .for_schedule_range(pay_period.starts_at, pay_period.ends_at)
          .select(:id)

        Shift
          .where(employee_id: employee_ids, calendar_event_id: event_ids)
          .includes(:service_type, calendar_event: [:clients, :recurring_patterns, :event_exceptions])
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
