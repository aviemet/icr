# frozen_string_literal: true

module Payroll
  class PeriodSummary
    ARCHIVE_KEYS = %i[
      workflow_status
      approved_count
      pending_count
      flagged_count
      facilitator_pending_shift_count
      overtime_hours
      payroll_due_date
    ].freeze

    SHOW_COUNT_KEYS = %i[
      total_count
      approved_count
      pending_count
      flagged_count
      facilitator_pending_shift_count
    ].freeze

    def self.call(pay_period, employee_ids: nil)
      new(pay_period, employee_ids: employee_ids).call
    end

    def self.archive_row(pay_period, employee_ids: nil)
      new(pay_period, employee_ids: employee_ids).archive_row
    end

    def initialize(pay_period, employee_ids: nil)
      @pay_period = pay_period
      @employee_ids = employee_ids || Employee.pluck(:id)
    end

    def call
      summary
    end

    def archive_row
      summary.slice(*ARCHIVE_KEYS).merge(
        id: @pay_period.id.to_s,
        starts_at: @pay_period.starts_at.iso8601,
        ends_at: @pay_period.ends_at.iso8601,
        finalized_at: @pay_period.finalized_at&.iso8601,
      )
    end

    def show_counts
      summary.slice(*SHOW_COUNT_KEYS)
    end

    private

    def summary
      @summary ||= build_summary
    end

    def build_summary
      exceptions = exception_counts
      approved_count = Timesheet
        .where(pay_period_id: @pay_period.id, employee_id: @employee_ids)
        .where.not(approved_at: nil)
        .count
      total_count = @employee_ids.size
      hours = EmployeePeriodHours.call(@pay_period, @employee_ids)
      overtime_hours = hours.values.sum { |row| row[:ot_hours].to_f }
      period_end = @pay_period.ends_at.to_date
      due_date = Period.payroll_due_date(period_end)

      {
        pay_period_id: @pay_period.id.to_s,
        starts_at: @pay_period.starts_at.iso8601,
        ends_at: @pay_period.ends_at.iso8601,
        payroll_due_date: due_date.strftime("%FT%T%:z"),
        finalized_at: @pay_period.finalized_at&.iso8601,
        workflow_status: workflow_status(period_end, approved_count, total_count),
        approval_window_open: !@pay_period.finalized? && Period.approval_window_open?(period_end),
        total_count: total_count,
        approved_count: approved_count,
        pending_count: total_count - approved_count,
        flagged_count: exceptions.count { |_id, data| data[:exception_count].to_i.positive? },
        facilitator_pending_shift_count: facilitator_pending_shift_count,
        overtime_hours: overtime_hours,
        exception_counts: exceptions,
      }
    end

    def facilitator_pending_shift_count
      PayPeriod.shifts_overlapping_period(@pay_period)
        .where(employee_id: @employee_ids, facilitator_approved_at: nil)
        .count
    end

    def exception_counts
      return {} if @employee_ids.empty?

      Timesheet
        .where(pay_period_id: @pay_period.id, employee_id: @employee_ids)
        .includes(shifts: :calendar_event)
        .each_with_object({}) do |timesheet, hash|
          data = ShiftExceptions.call(timesheet.shifts)
          hash[timesheet.employee_id.to_s] = { exception_count: data[:exception_count] }
        end
    end

    def workflow_status(period_end, approved_count, total_count)
      return "closed" if @pay_period.finalized?
      return "approved" if total_count.positive? && approved_count == total_count

      today = Date.current
      period_start = @pay_period.starts_at.to_date

      return "open" if today < period_start
      return "pending" if today >= period_end

      "current"
    end
  end
end
