# frozen_string_literal: true

require "csv"

module Payroll
  class HoursExport
    HEADERS = [
      "employee_number",
      "employee_name",
      "period_starts_on",
      "period_ends_on",
      "regular_hours",
      "overtime_hours",
      "pto_hours",
      "sick_hours",
      "holiday_hours",
      "total_hours",
      "approved_at",
      "timesheet_id",
    ].freeze

    def self.call(pay_period)
      new(pay_period).call
    end

    def initialize(pay_period)
      @pay_period = pay_period
    end

    def call
      employee_ids = Employee.order(:created_at).pluck(:id)
      hours_by_employee = EmployeePeriodHours.call(@pay_period, employee_ids)
      timesheets = Timesheet
        .where(pay_period_id: @pay_period.id, employee_id: employee_ids)
        .includes(:employee)
        .index_by(&:employee_id)
      period_starts_on = @pay_period.starts_at.to_date.iso8601
      period_ends_on = @pay_period.ends_at.to_date.iso8601

      CSV.generate(headers: true) do |csv|
        csv << HEADERS
        employee_ids.each do |employee_id|
          timesheet = timesheets[employee_id]
          next if timesheet.blank? || timesheet.approved_at.blank?

          employee = timesheet.employee
          hours = hours_by_employee[employee_id.to_s] || {}
          regular_hours = hours[:regular_hours].to_f
          overtime_hours = hours[:ot_hours].to_f
          pto_hours = hours[:pto_hours].to_f
          sick_hours = hours[:sick_hours].to_f
          holiday_hours = hours[:holiday_hours].to_f

          csv << [
            employee.number,
            employee.full_name.presence || employee.name,
            period_starts_on,
            period_ends_on,
            format("%.2f", regular_hours),
            format("%.2f", overtime_hours),
            format("%.2f", pto_hours),
            format("%.2f", sick_hours),
            format("%.2f", holiday_hours),
            format("%.2f", regular_hours + overtime_hours + pto_hours + sick_hours + holiday_hours),
            timesheet.approved_at.iso8601,
            timesheet.id.to_s,
          ]
        end
      end
    end
  end
end
