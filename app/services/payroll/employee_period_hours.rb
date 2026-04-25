# frozen_string_literal: true

module Payroll
  class EmployeePeriodHours
    # Keep the public entrypoint stable while allowing callers to swap data sources
    # (scheduled shifts, clock punches) without changing overtime math.
    #
    # @param pay_period [PayPeriod]
    # @param employee_ids [Array<String, UUID>]
    # @param collector [Payroll::WorkIntervalCollector]
    def self.call(pay_period, employee_ids, collector: WorkIntervalCollectors::ScheduledShifts.new)
      new(pay_period, employee_ids, collector: collector).call
    end

    # Capture pay period boundaries and overtime settings once so the calculation
    # is deterministic for the run and does not re-read settings per interval.
    #
    # @param pay_period [PayPeriod]
    # @param employee_ids [Array<String, UUID>]
    # @param collector [Payroll::WorkIntervalCollector]
    def initialize(pay_period, employee_ids, collector:)
      @pay_period = pay_period
      @employee_ids = employee_ids
      @collector = collector
      @period_start = pay_period.starts_at.to_date
      @period_end = pay_period.ends_at.to_date
      @week_start_day = Setting.payroll_period_day.to_sym
      @weekly_threshold = Setting.overtime_weekly_hours
      @daily_threshold = Setting.overtime_daily_hours
      @exemptions = OvertimeExemption.where(active: true).to_a
    end

    # Return a per-employee summary hash that matches the frontend contract
    # (string keys) while keeping the core math independent from how intervals
    # are collected.
    def call
      return {} if @employee_ids.empty?

      intervals = @collector.intervals_for(pay_period: @pay_period, employee_ids: @employee_ids)

      intervals
        .group_by(&:employee_id)
        .each_with_object({}) do |(employee_id, employee_intervals), hash|
          hash[employee_id.to_s] = hours_for_intervals(employee_intervals)
      end
    end

    private

    # Compute weekly and daily overtime using the configured thresholds, after
    # splitting overnight intervals across dates so totals match pay rules.
    def hours_for_intervals(intervals)
      total_hours = 0.0
      daily_hours = Hash.new(0.0)
      weekly_hours = Hash.new(0.0)
      overnight_ot = 0.0

      intervals.each do |interval|
        next if exempt?(interval)

        if overnight?(interval)
          overnight_ot += interval.duration_hours
          total_hours += interval.duration_hours
          next
        end

        hours_by_date(interval).each do |date, hours|
          total_hours += hours
          daily_hours[date] += hours
          week_start = date.beginning_of_week(@week_start_day)
          weekly_hours[week_start] += hours
        end
      end

      daily_ot_by_date = daily_hours.transform_values { |h| [h - @daily_threshold, 0].max }
      weekly_ot_by_week = weekly_hours.transform_values { |h| [h - @weekly_threshold, 0].max }
      threshold_ot = daily_ot_by_date.values.sum + weekly_ot_by_week.values.sum
      ot_hours = (threshold_ot + overnight_ot).round(2)
      regular_hours = (total_hours - ot_hours).round(2)
      regular_hours = 0.0 if regular_hours.negative?

      shift_ot_hours = shift_ot_hours_for_intervals(
        intervals,
        daily_hours: daily_hours,
        weekly_hours: weekly_hours,
        daily_ot_by_date: daily_ot_by_date,
        weekly_ot_by_week: weekly_ot_by_week,
      )

      { regular_hours: regular_hours, ot_hours: ot_hours, shift_ot_hours: shift_ot_hours }
    end

    def shift_ot_hours_for_intervals(intervals, daily_hours:, weekly_hours:, daily_ot_by_date:, weekly_ot_by_week:)
      intervals.each_with_object({}) do |interval, hash|
        next unless interval.respond_to?(:id)

        if exempt?(interval)
          hash[interval.id.to_s] = 0.0
          next
        end

        if overnight?(interval)
          hash[interval.id.to_s] = interval.duration_hours.round(2)
          next
        end

        interval_ot = 0.0
        hours_by_date(interval).each do |date, hours|
          total = daily_hours[date]
          next if total.zero?

          interval_ot += (hours / total) * daily_ot_by_date[date]
        end

        interval_weekly_hours = Hash.new(0.0)
        hours_by_date(interval).each do |date, hours|
          week_start = date.beginning_of_week(@week_start_day)
          interval_weekly_hours[week_start] += hours
        end
        interval_weekly_hours.each do |week_start, interval_w|
          total = weekly_hours[week_start]
          next if total.zero?

          interval_ot += (interval_w / total) * weekly_ot_by_week[week_start]
        end

        hash[interval.id.to_s] = interval_ot.round(2)
      end
    end

    def overnight?(shift)
      start_time = shift.start_time
      end_time = shift.end_time
      return false if start_time.blank? || end_time.blank?

      start_time.to_date != end_time.to_date
    end

    # Allow business-configured exemption rules to remove some work from overtime
    # calculations without requiring special-case logic in each collector.
    def exempt?(interval)
      @exemptions.any? { |exemption| exemption.matches?(interval) }
    end

    # Overtime thresholds are day/week based, so a single interval must be
    # allocated across all dates it spans (e.g., 10pm-6am counts on two days).
    def hours_by_date(interval)
      start_time = interval.start_time
      end_time = interval.end_time
      return {} if start_time.blank? || end_time.blank?

      start_sec = start_time.to_i
      end_sec = end_time.to_i
      start_date = start_time.to_date
      end_date = end_time.to_date
      return {} if start_date > end_date

      result = {}
      (start_date..end_date).each do |current_date|
        day_begin = Time.zone.local(current_date.year, current_date.month, current_date.day, 0, 0, 0)
        day_end_t = day_begin.end_of_day
        day_start_sec = [start_sec, day_begin.to_i].max
        day_end_sec = [end_sec, day_end_t.to_i].min
        next if day_start_sec >= day_end_sec

        result[current_date] = (day_end_sec - day_start_sec) / 3600.0
      end

      result
    end
  end
end
