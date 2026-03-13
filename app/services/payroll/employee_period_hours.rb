# frozen_string_literal: true

module Payroll
  class EmployeePeriodHours
    def self.call(pay_period, employee_ids)
      new(pay_period, employee_ids).call
    end

    def initialize(pay_period, employee_ids)
      @pay_period = pay_period
      @employee_ids = employee_ids
      @period_start = pay_period.starts_at.to_date
      @period_end = pay_period.ends_at.to_date
      @week_start_day = Setting.payroll_period_day.to_sym
      @weekly_threshold = Setting.overtime_weekly_hours
      @daily_threshold = Setting.overtime_daily_hours
      @exemptions = OvertimeExemption.where(active: true).to_a
    end

    def call
      return {} if @employee_ids.empty?

      timesheets = Timesheet
        .where(pay_period_id: @pay_period.id, employee_id: @employee_ids)
        .includes(shifts: [:category, :calendar_event])

      timesheets.each_with_object({}) do |timesheet, hash|
        employee_id = timesheet.employee_id.to_s
        hash[employee_id] = hours_for_timesheet(timesheet)
      end
    end

    private

    def hours_for_timesheet(timesheet)
      total_hours = 0.0
      daily_hours = Hash.new(0.0)
      weekly_hours = Hash.new(0.0)
      overnight_ot = 0.0

      timesheet.shifts.each do |shift|
        next if exempt?(shift)

        if overnight?(shift)
          overnight_ot += shift.duration_hours
          total_hours += shift.duration_hours
        else
          hours_by_date(shift).each do |date, hours|
            total_hours += hours
            daily_hours[date] += hours
            week_start = date.beginning_of_week(@week_start_day)
            weekly_hours[week_start] += hours
          end
        end
      end

      daily_ot_by_date = daily_hours.transform_values { |h| [h - @daily_threshold, 0].max }
      weekly_ot_by_week = weekly_hours.transform_values { |h| [h - @weekly_threshold, 0].max }
      threshold_ot = daily_ot_by_date.values.sum + weekly_ot_by_week.values.sum
      ot_hours = (threshold_ot + overnight_ot).round(2)
      regular_hours = (total_hours - ot_hours).round(2)
      regular_hours = 0.0 if regular_hours.negative?

      shift_ot_hours = shift_ot_hours_for_timesheet(
        timesheet,
        daily_hours: daily_hours,
        weekly_hours: weekly_hours,
        daily_ot_by_date: daily_ot_by_date,
        weekly_ot_by_week: weekly_ot_by_week,
      )

      { regular_hours: regular_hours, ot_hours: ot_hours, shift_ot_hours: shift_ot_hours }
    end

    def shift_ot_hours_for_timesheet(timesheet, daily_hours:, weekly_hours:, daily_ot_by_date:, weekly_ot_by_week:)
      timesheet.shifts.each_with_object({}) do |shift, hash|
        if exempt?(shift)
          hash[shift.id.to_s] = 0.0
          next
        end

        if overnight?(shift)
          hash[shift.id.to_s] = shift.duration_hours.round(2)
          next
        end

        shift_ot = 0.0
        hours_by_date(shift).each do |date, hours|
          total = daily_hours[date]
          next if total.zero?

          shift_ot += (hours / total) * daily_ot_by_date[date]
        end

        shift_weekly_hours = Hash.new(0.0)
        hours_by_date(shift).each do |date, hours|
          week_start = date.beginning_of_week(@week_start_day)
          shift_weekly_hours[week_start] += hours
        end
        shift_weekly_hours.each do |week_start, shift_w|
          total = weekly_hours[week_start]
          next if total.zero?

          shift_ot += (shift_w / total) * weekly_ot_by_week[week_start]
        end

        hash[shift.id.to_s] = shift_ot.round(2)
      end
    end

    def overnight?(shift)
      start_time = shift.start_time
      end_time = shift.end_time
      return false if start_time.blank? || end_time.blank?

      start_time.to_date != end_time.to_date
    end

    def exempt?(shift)
      @exemptions.any? { |e| e.matches?(shift) }
    end

    def hours_by_date(shift)
      start_time = shift.start_time
      end_time = shift.end_time
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
