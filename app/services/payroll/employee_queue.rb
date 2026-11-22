# frozen_string_literal: true

module Payroll
  class EmployeeQueue
    def self.call(period:, employees:, total_count:, pagination:, exception_counts: nil)
      new(
        period: period,
        employees: employees,
        total_count: total_count,
        pagination: pagination,
        exception_counts: exception_counts,
      ).call
    end

    def initialize(period:, employees:, total_count:, pagination:, exception_counts: nil)
      @period = period
      @employees = employees
      @total_count = total_count
      @pagination = pagination
      @exception_counts = exception_counts
    end

    def call
      page_employees = @employees.load
      page_employee_ids = page_employees.map(&:id)
      employee_hours = EmployeePeriodHours.call(@period, page_employee_ids)
      page_timesheets = Timesheet.where(pay_period_id: @period.id, employee_id: page_employee_ids)
        .pluck(:employee_id, :id, :approved_at)
      period_exceptions = @exception_counts || {}
      facilitator_progress = facilitator_progress_for(page_employee_ids)
      timesheet_ids = page_timesheets.map { |_employee_id, timesheet_id, _approved_at| timesheet_id }

      {
        timesheet_ids_by_employee: page_timesheets.to_h { |employee_id, timesheet_id, _approved_at|
          [employee_id.to_s, timesheet_id]
        },
        approved_at_by_employee: page_timesheets.each_with_object({}) do |(employee_id, _timesheet_id, approved_at), hash|
          next if approved_at.blank?

          hash[employee_id.to_s] = approved_at.iso8601
        end,
        facilitator_shift_count_by_employee: facilitator_progress.transform_values { |row| row[:total] },
        facilitator_reviewed_shift_count_by_employee: facilitator_progress.transform_values { |row| row[:reviewed] },
        unreviewed_shifts_by_timesheet: unreviewed_shifts_for(timesheet_ids),
        employee_exceptions: page_employee_ids.each_with_object({}) do |employee_id, hash|
          key = employee_id.to_s
          hash[key] = period_exceptions[key] if period_exceptions[key]
        end,
        employees: page_employees.render(:index),
        employee_hours: employee_hours,
        pagination: {
          count: @total_count,
          **(@pagination || {}),
        },
      }
    end

    private

    def facilitator_progress_for(employee_ids)
      return {} if employee_ids.empty?

      base_shifts = PayPeriod.shifts_overlapping_period(@period)
        .where(employee_id: employee_ids)
        .includes(calendar_event: [:recurring_patterns, :event_exceptions])
        .to_a

      @period.shift_occurrences(base_shifts).each_with_object({}) do |occurrence, hash|
        key = occurrence.employee_id.to_s
        entry = hash[key] ||= { total: 0, reviewed: 0 }
        entry[:total] += 1
        entry[:reviewed] += 1 if occurrence.facilitator_approved?
      end
    end

    def unreviewed_shifts_for(timesheet_ids)
      return {} if timesheet_ids.empty?

      Timesheet.where(id: timesheet_ids).includes(shifts: { calendar_event: { clients: :person } }).each_with_object({}) do |timesheet, hash|
        rows = UnreviewedShifts.call(timesheet)
        next if rows.empty?

        hash[timesheet.id.to_s] = rows
      end
    end
  end
end
