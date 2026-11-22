# frozen_string_literal: true

module Payroll
  class ClientPeriodIhssHours
    def self.call(pay_period:, client_ids:)
      new(pay_period: pay_period, client_ids: client_ids).call
    end

    def initialize(pay_period:, client_ids:)
      @pay_period = pay_period
      @client_ids = Array(client_ids)
    end

    def call
      return {} if @client_ids.empty?

      shifts = shifts_for_clients
      return @client_ids.index_with { 0.0 }.transform_keys(&:to_s) if shifts.empty?

      collected = shifts.flat_map { |shift| intervals_for_shift(shift) }
      intervals = IhssHourClassifier.call(pay_period: @pay_period, intervals: collected)

      totals = @client_ids.index_with { 0.0 }
      intervals.select(&:ihss?).each do |interval|
        matching = interval.client_ids & @client_ids
        next if matching.empty?

        share = interval.duration_hours / matching.size
        matching.each { |client_id| totals[client_id] += share }
      end

      totals.transform_keys(&:to_s).transform_values { |hours| hours.round(2) }
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
        :category,
        calendar_event: [:clients, :recurring_patterns, :event_exceptions],
      )
    end

    def intervals_for_shift(shift)
      event = shift.calendar_event
      return [] if event.blank?

      Calendar::Recurring::ExpandOccurrences
        .call(event:, range_start: @pay_period.starts_at, range_end: @pay_period.ends_at)
        .filter_map do |occurrence|
          client_ids = occurrence.event.clients.map(&:id)
          next if !client_ids.intersect?(@client_ids)

          WorkInterval.new(
            id: interval_id(shift, occurrence),
            employee_id: shift.employee_id,
            starts_at: occurrence.starts_at,
            ends_at: occurrence.ends_at,
            category: shift.category,
            ihss: shift.ihss,
            client_ids: client_ids,
          )
        end
    end

    def interval_id(shift, occurrence)
      return shift.id unless occurrence.recurring

      "#{shift.id}:#{occurrence.original_starts_at.utc.iso8601(3)}"
    end
  end
end
