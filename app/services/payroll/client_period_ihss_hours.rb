# frozen_string_literal: true

module Payroll
  class ClientPeriodIhssHours
    def self.call(pay_period:, client_ids:)
      new(pay_period: pay_period, client_ids: client_ids).call
    end

    def initialize(pay_period:, client_ids:)
      @pay_period = pay_period
      @client_ids = Array(client_ids).map(&:to_s)
    end

    def call
      empty = @client_ids.index_with { 0.0 }
      return empty if @client_ids.empty?

      shifts = shifts_for_clients
      return empty if shifts.empty?

      employee_ids = shifts.map(&:employee_id).compact.uniq
      collected = WorkIntervalCollectors::ScheduledShifts.new.intervals_for(
        pay_period: @pay_period,
        employee_ids: employee_ids,
      )
      relevant = collected.select { |interval| interval.client_ids.intersect?(@client_ids) }
      within = Hours::PeriodWindow.for(@pay_period).clip(relevant).within
      ledger = IhssHourClassifier.call_with_ledger(pay_period: @pay_period, intervals: within)

      totals = empty.dup
      ledger.client_hours.each do |client_id, hours|
        next unless totals.key?(client_id)

        totals[client_id] += hours
      end

      totals.transform_values { |hours| hours.round(2) }
    end

    private

    def shifts_for_clients
      shift_ids = PayPeriod.shifts_overlapping_period(@pay_period)
        .assigned
        .joins(calendar_event: :event_participants)
        .where(
          event_participants: {
            participant_type: "Client",
            participant_id: @client_ids,
          },
        )
        .distinct
        .pluck(:id)

      Shift.where(id: shift_ids).includes(
        :service_type,
        calendar_event: [:clients, :recurring_patterns, :event_exceptions],
      )
    end
  end
end
