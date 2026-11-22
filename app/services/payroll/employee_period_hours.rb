# frozen_string_literal: true

module Payroll
  class EmployeePeriodHours
    def self.call(pay_period, employee_ids, collector: WorkIntervalCollectors::ScheduledShifts.new)
      new(pay_period, employee_ids, collector: collector).call
    end

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
      @co_employer = Setting.ihss_co_employer
    end

    def call
      return {} if @employee_ids.empty?

      collected = @collector.intervals_for(pay_period: @pay_period, employee_ids: @employee_ids)
      intervals = IhssHourClassifier.call(pay_period: @pay_period, intervals: collected)

      intervals
        .group_by(&:employee_id)
        .each_with_object({}) do |(employee_id, employee_intervals), hash|
        hash[employee_id.to_s] = hours_for_intervals(employee_intervals)
      end
    end

    private

    def hours_for_intervals(intervals)
      ihss_hours = intervals.select(&:ihss?).sum(&:duration_hours).round(2)
      company_hours = intervals.reject(&:ihss?).sum(&:duration_hours).round(2)
      ot_eligible = ot_eligible_intervals(intervals)

      total_hours = 0.0
      daily_hours = Hash.new(0.0)
      weekly_hours = Hash.new(0.0)

      ot_eligible.each do |interval|
        next if exempt?(interval)

        hours_by_date(interval).each do |date, hours|
          total_hours += hours
          daily_hours[date] += hours
          week_start = date.beginning_of_week(@week_start_day)
          weekly_hours[week_start] += hours
        end
      end

      daily_ot_by_date = daily_hours.transform_values { |hours| [hours - @daily_threshold, 0].max }
      weekly_ot_by_week = weekly_hours.transform_values { |hours| [hours - @weekly_threshold, 0].max }
      ot_hours = (daily_ot_by_date.values.sum + weekly_ot_by_week.values.sum).round(2)
      regular_hours = (total_hours - ot_hours).round(2)
      regular_hours = 0.0 if regular_hours.negative?

      shift_ot_hours = shift_ot_hours_for_intervals(
        ot_eligible,
        daily_hours: daily_hours,
        weekly_hours: weekly_hours,
        daily_ot_by_date: daily_ot_by_date,
        weekly_ot_by_week: weekly_ot_by_week,
      )

      {
        regular_hours: regular_hours,
        ot_hours: ot_hours,
        shift_ot_hours: shift_ot_hours,
        ihss_hours: ihss_hours,
        company_hours: company_hours,
      }
    end

    def ot_eligible_intervals(intervals)
      return intervals if @co_employer

      intervals.reject(&:ihss?)
    end

    def shift_ot_hours_for_intervals(intervals, daily_hours:, weekly_hours:, daily_ot_by_date:, weekly_ot_by_week:)
      intervals.each_with_object(Hash.new(0.0)) do |interval, hash|
        next if interval.id.blank?

        if exempt?(interval)
          hash[interval.id.to_s] += 0.0
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

        hash[interval.id.to_s] += interval_ot.round(2)
      end
    end

    def exempt?(interval)
      @exemptions.any? { |exemption| exemption.matches?(interval) }
    end

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
