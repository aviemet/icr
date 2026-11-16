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

      {
        timesheet_ids_by_employee: page_timesheets.to_h { |employee_id, timesheet_id, _approved_at|
          [employee_id.to_s, timesheet_id]
        },
        approved_at_by_employee: page_timesheets.each_with_object({}) do |(employee_id, _timesheet_id, approved_at), hash|
          next if approved_at.blank?

          hash[employee_id.to_s] = approved_at.iso8601
        end,
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
  end
end
