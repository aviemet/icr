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

      timesheet.shifts.each do |shift|
        next if exempt?(shift)

        hours_by_date(shift).each do |date, hours|
          total_hours += hours
          daily_hours[date] += hours
          week_start = date.beginning_of_week(@week_start_day)
          weekly_hours[week_start] += hours
        end
      end

      weekly_ot = weekly_hours.values.sum { |h| [h - @weekly_threshold, 0].max }
      daily_ot = daily_hours.values.sum { |h| [h - @daily_threshold, 0].max }
      ot_hours = (weekly_ot + daily_ot).round(2)
      regular_hours = (total_hours - ot_hours).round(2)
      regular_hours = 0.0 if regular_hours.negative?

      { regular_hours: regular_hours, ot_hours: ot_hours }
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
