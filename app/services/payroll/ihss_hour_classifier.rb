# frozen_string_literal: true

module Payroll
  class IhssHourClassifier
    Result = Data.define(:intervals, :client_hours)

    def self.call(pay_period:, intervals:, assignment_mode: Setting.ihss_assignment_mode)
      new(pay_period: pay_period, intervals: intervals, assignment_mode: assignment_mode).call
    end

    def self.call_with_ledger(pay_period:, intervals:, assignment_mode: Setting.ihss_assignment_mode)
      new(pay_period: pay_period, intervals: intervals, assignment_mode: assignment_mode).call_with_ledger
    end

    def initialize(pay_period:, intervals:, assignment_mode:)
      @pay_period = pay_period
      @intervals = intervals
      @assignment_mode = assignment_mode.to_s
      @client_hours = Hash.new(0.0)
    end

    def call
      call_with_ledger.intervals
    end

    def call_with_ledger
      intervals = shift_mode? ? classify_shift_mode : classify_by_period
      Result.new(intervals: intervals, client_hours: @client_hours.transform_values { |hours| hours.round(2) })
    end

    private

    def shift_mode?
      @assignment_mode == Setting::IHSS_ASSIGNMENT_MODES[:shift]
    end

    def classify_shift_mode
      @intervals.flat_map { |interval| expand_shift_mode(interval) }
    end

    def expand_shift_mode(interval)
      return [copy_interval(interval, ihss: false)] unless interval.ihss?

      clients = interval.client_ids
      return [copy_interval(interval, ihss: true)] if clients.empty?

      share = interval.duration_hours / clients.size
      clients.each { |client_id| @client_hours[client_id.to_s] += share }

      cursor = interval.starts_at
      clients.map.with_index do |client_id, index|
        slice_hours = if index == clients.size - 1
                        ((interval.ends_at - cursor) / 1.hour.to_f)
                      else
                        share
                      end
        ends_at = cursor + slice_hours.hours
        row = copy_interval(
          interval,
          starts_at: cursor,
          ends_at: ends_at,
          ihss: true,
          consuming_client_id: client_id,
        )
        cursor = ends_at
        row
      end
    end

    def classify_by_period
      remaining_by_key = assignments_remaining
      ordered = @intervals.sort_by { |interval| [interval.starts_at || Time.zone.at(0), interval.id.to_s] }

      ordered.flat_map do |interval|
        consume_interval(interval, remaining_by_key)
      end
    end

    def assignments_remaining
      Payroll::IhssPeriodAssignment
        .where(pay_period_id: @pay_period.id)
        .each_with_object(Hash.new(0.0)) do |assignment, hash|
          hash[assignment_key(assignment.employee_id, assignment.client_id)] = assignment.hours.to_f
        end
    end

    def consume_interval(interval, remaining_by_key)
      available = interval.duration_hours
      return [copy_interval(interval, ihss: false)] if available <= 0

      cursor = interval.starts_at
      pieces = []
      remaining = available

      interval.client_ids.each do |client_id|
        break if remaining <= 0

        key = assignment_key(interval.employee_id, client_id)
        assignment_remaining = remaining_by_key[key]
        next if assignment_remaining <= 0

        take = [assignment_remaining, remaining].min
        ends_at = cursor + take.hours
        pieces << copy_interval(
          interval,
          starts_at: cursor,
          ends_at: ends_at,
          ihss: true,
          consuming_client_id: client_id,
        )
        @client_hours[client_id.to_s] += take
        remaining_by_key[key] = assignment_remaining - take
        cursor = ends_at
        remaining -= take
      end

      if remaining.positive?
        pieces << copy_interval(
          interval,
          starts_at: cursor,
          ends_at: interval.ends_at,
          ihss: false,
        )
      end

      return [copy_interval(interval, ihss: false)] if pieces.empty?

      pieces
    end

    def copy_interval(interval, **overrides)
      WorkInterval.new(
        id: interval.id,
        employee_id: interval.employee_id,
        starts_at: overrides.fetch(:starts_at, interval.starts_at),
        ends_at: overrides.fetch(:ends_at, interval.ends_at),
        category: interval.category,
        ihss: overrides.fetch(:ihss, interval.ihss?),
        client_ids: interval.client_ids,
        leave_kind: interval.leave_kind,
        consuming_client_id: overrides[:consuming_client_id],
      )
    end

    def assignment_key(employee_id, client_id)
      "#{employee_id}:#{client_id}"
    end
  end
end
