# frozen_string_literal: true

module Payroll
  class IhssHourClassifier
    def self.call(pay_period:, intervals:, assignment_mode: Setting.ihss_assignment_mode)
      new(pay_period: pay_period, intervals: intervals, assignment_mode: assignment_mode).call
    end

    def initialize(pay_period:, intervals:, assignment_mode:)
      @pay_period = pay_period
      @intervals = intervals
      @assignment_mode = assignment_mode.to_s
    end

    def call
      return @intervals.map { |interval| with_ihss(interval, interval.ihss?) } if shift_mode?

      classify_by_period
    end

    private

    def shift_mode?
      @assignment_mode == Setting::IHSS_ASSIGNMENT_MODES[:shift]
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
      return [with_ihss(interval, false)] if available <= 0

      ihss_hours = 0.0
      interval.client_ids.each do |client_id|
        break if ihss_hours >= available

        key = assignment_key(interval.employee_id, client_id)
        remaining = remaining_by_key[key]
        next if remaining <= 0

        take = [remaining, available - ihss_hours].min
        remaining_by_key[key] = remaining - take
        ihss_hours += take
      end

      split_interval(interval, ihss_hours)
    end

    def split_interval(interval, ihss_hours)
      total = interval.duration_hours
      ihss_hours = ihss_hours.clamp(0.0, total)
      company_hours = total - ihss_hours

      return [with_ihss(interval, false)] if ihss_hours <= 0
      return [with_ihss(interval, true)] if company_hours <= 0

      ihss_ends_at = interval.starts_at + ihss_hours.hours
      [
        with_times(interval, interval.starts_at, ihss_ends_at, true),
        with_times(interval, ihss_ends_at, interval.ends_at, false),
      ]
    end

    def with_times(interval, starts_at, ends_at, ihss)
      WorkInterval.new(
        id: interval.id,
        employee_id: interval.employee_id,
        starts_at: starts_at,
        ends_at: ends_at,
        category: interval.category,
        ihss: ihss,
        client_ids: interval.client_ids,
        leave_kind: interval.leave_kind,
      )
    end

    def with_ihss(interval, ihss)
      WorkInterval.new(
        id: interval.id,
        employee_id: interval.employee_id,
        starts_at: interval.starts_at,
        ends_at: interval.ends_at,
        category: interval.category,
        ihss: ihss,
        client_ids: interval.client_ids,
        leave_kind: interval.leave_kind,
      )
    end

    def assignment_key(employee_id, client_id)
      "#{employee_id}:#{client_id}"
    end
  end
end
