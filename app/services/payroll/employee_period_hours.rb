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
      leave_intervals, work_intervals = intervals.partition(&:leave?)

      pto_hours = leave_intervals.select { |interval| interval.leave_kind == :pto }.sum(&:duration_hours).round(2)
      sick_hours = leave_intervals.select { |interval| interval.leave_kind == :sick }.sum(&:duration_hours).round(2)
      holiday_hours = leave_intervals.select { |interval| interval.leave_kind == :holiday }.sum(&:duration_hours).round(2)

      ihss_hours = work_intervals.select(&:ihss?).sum(&:duration_hours).round(2)
      company_hours = work_intervals.reject(&:ihss?).sum(&:duration_hours).round(2)
      ot_eligible = ot_eligible_intervals(work_intervals)
      classified = classify_ot(ot_eligible)

      {
        regular_hours: classified[:regular_hours],
        ot_hours: classified[:ot_hours],
        shift_ot_hours: classified[:shift_ot_hours],
        ihss_hours: ihss_hours,
        company_hours: company_hours,
        pto_hours: pto_hours,
        sick_hours: sick_hours,
        holiday_hours: holiday_hours,
      }
    end

    def ot_eligible_intervals(intervals)
      return intervals if @co_employer

      intervals.reject(&:ihss?)
    end

    def classify_ot(intervals)
      shift_ot_hours = Hash.new(0.0)
      total_hours = 0.0

      intervals.each do |interval|
        next if interval.id.blank?

        shift_ot_hours[interval.id.to_s] = 0.0
      end

      segments_by_day = Hash.new { |days, date| days[date] = [] }

      intervals.each do |interval|
        next if exempt?(interval)

        hours_by_date(interval).each do |date, hours|
          total_hours += hours
          segments_by_day[date] << {
            interval_id: interval.id.presence&.to_s,
            date: date,
            hours: hours,
            start_time: interval.start_time,
          }
        end
      end

      straight_by_week = Hash.new { |weeks, week_start| weeks[week_start] = [] }
      ot_hours = 0.0

      segments_by_day.keys.sort.each do |date|
        day_total = 0.0
        ordered = segments_by_day[date].sort_by { |segment| segment[:start_time].to_i }
        week_start = date.beginning_of_week(@week_start_day)

        ordered.each do |segment|
          hours = segment[:hours]
          if day_total >= @daily_threshold
            ot_hours += hours
            shift_ot_hours[segment[:interval_id]] += hours if segment[:interval_id]
          elsif day_total + hours > @daily_threshold
            daily_ot = day_total + hours - @daily_threshold
            straight = hours - daily_ot
            ot_hours += daily_ot
            shift_ot_hours[segment[:interval_id]] += daily_ot if segment[:interval_id]
            if straight.positive?
              straight_by_week[week_start] << {
                interval_id: segment[:interval_id],
                date: date,
                hours: straight,
                start_time: segment[:start_time],
              }
            end
          else
            straight_by_week[week_start] << {
              interval_id: segment[:interval_id],
              date: date,
              hours: hours,
              start_time: segment[:start_time],
            }
          end
          day_total += hours
        end
      end

      straight_by_week.each_value do |segments|
        ordered = segments.sort_by { |segment| [segment[:date], segment[:start_time].to_i] }
        week_total = 0.0

        ordered.each do |segment|
          hours = segment[:hours]
          if week_total >= @weekly_threshold
            ot_hours += hours
            shift_ot_hours[segment[:interval_id]] += hours if segment[:interval_id]
          elsif week_total + hours > @weekly_threshold
            weekly_ot = week_total + hours - @weekly_threshold
            ot_hours += weekly_ot
            shift_ot_hours[segment[:interval_id]] += weekly_ot if segment[:interval_id]
          end
          week_total += hours
        end
      end

      ot_hours = ot_hours.round(2)
      regular_hours = (total_hours - ot_hours).round(2)
      regular_hours = 0.0 if regular_hours.negative?

      {
        regular_hours: regular_hours,
        ot_hours: ot_hours,
        shift_ot_hours: shift_ot_hours.transform_values { |hours| hours.round(2) },
      }
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
