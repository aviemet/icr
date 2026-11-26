# frozen_string_literal: true

module Payroll
  class UnreviewedShifts
    def self.call(timesheet)
      new(timesheet).call
    end

    def initialize(timesheet)
      @timesheet = timesheet
    end

    def call
      return [] if @timesheet.blank?

      period = @timesheet.pay_period
      return [] if period.blank?

      base_shifts = PayPeriod.shifts_overlapping_period(period)
        .assigned
        .where(employee_id: @timesheet.employee_id)
        .includes(calendar_event: [:recurring_patterns, :event_exceptions, { clients: :person }])
        .to_a

      period.shift_occurrences(base_shifts)
        .reject(&:facilitator_approved?)
        .map { |shift| serialize(shift) }
    end

    private

    def serialize(shift)
      clients = shift.calendar_event&.clients || []
      {
        id: shift.id.to_s,
        shift_id: shift.respond_to?(:shift_id) ? shift.shift_id.to_s : shift.id.to_s,
        starts_at: shift.starts_at&.iso8601,
        client_names: clients.map(&:full_name).compact,
      }
    end
  end
end
