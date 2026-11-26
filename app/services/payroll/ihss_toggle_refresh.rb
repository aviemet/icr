# frozen_string_literal: true

module Payroll
  class IhssToggleRefresh
    def self.call(pay_period:, shift:, occurrence_starts_at:, ihss:, client_id: nil)
      new(
        pay_period: pay_period,
        shift: shift,
        occurrence_starts_at: occurrence_starts_at,
        ihss: ihss,
        client_id: client_id,
      ).call
    end

    def initialize(pay_period:, shift:, occurrence_starts_at:, ihss:, client_id:)
      @pay_period = pay_period
      @shift = shift
      @occurrence_starts_at = occurrence_starts_at
      @ihss = ihss
      @client_id = client_id.presence&.to_s
    end

    def call
      employee_id = @shift.employee_id.to_s
      intervals = WorkIntervalCollectors::ScheduledShifts.new.intervals_for(
        pay_period: @pay_period,
        employee_ids: [@shift.employee_id],
      )
      hours = EmployeePeriodHours.call(
        @pay_period,
        [@shift.employee_id],
        collector: StaticIntervals.new(intervals),
      )[employee_id] || {}

      payload = {
        id: ShiftOccurrence.interval_id_for(
          @shift.id,
          @occurrence_starts_at,
          recurring: @shift.calendar_event.recurring_patterns.any?,
        ),
        ihss: @ihss,
        shift_ot_hours: zero_filled_shift_ot_hours(intervals, hours[:shift_ot_hours] || {}),
        employee_hours: hours.except(:shift_ot_hours),
      }
      payload[:ihss_hours_used] = ihss_hours_used if @client_id
      payload
    end

    private

    class StaticIntervals
      def initialize(intervals)
        @intervals = intervals
      end

      def intervals_for(**)
        @intervals
      end
    end

    def zero_filled_shift_ot_hours(intervals, shift_ot_hours)
      intervals.each_with_object({}) do |interval, hash|
        next if interval.id.blank?

        hash[interval.id.to_s] = shift_ot_hours.fetch(interval.id.to_s, 0.0)
      end
    end

    def ihss_hours_used
      ClientPeriodIhssHours.call(pay_period: @pay_period, client_ids: [@client_id]).fetch(@client_id, 0.0)
    end
  end
end
