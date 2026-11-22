# frozen_string_literal: true

module Payroll
  class IhssPeriodAssignmentBoard
    def self.call(period:)
      new(period: period).call
    end

    def initialize(period:)
      @period = period
    end

    def call
      rows = employee_client_pairs
      assignments = Payroll::IhssPeriodAssignment
        .where(pay_period_id: @period.id)
        .index_by { |row| "#{row.employee_id}:#{row.client_id}" }

      {
        assignment_rows: rows.map do |row|
          key = "#{row[:employee_id]}:#{row[:client_id]}"
          assignment = assignments[key]
          {
            employee_id: row[:employee_id].to_s,
            employee_name: row[:employee_name],
            client_id: row[:client_id].to_s,
            client_name: row[:client_name],
            hours: assignment&.hours&.to_f || 0.0,
            authorized_hours: row[:authorized_hours],
          }
        end,
      }
    end

    private

    def employee_client_pairs
      shifts = PayPeriod.shifts_overlapping_period(@period)
        .assigned
        .includes(:employee, calendar_event: { clients: :person })

      pairs = {}
      shifts.each do |shift|
        next if shift.employee.blank?

        shift.calendar_event&.clients&.each do |client|
          key = "#{shift.employee_id}:#{client.id}"
          pairs[key] ||= {
            employee_id: shift.employee_id,
            employee_name: shift.employee.full_name.presence || shift.employee.name || "-",
            client_id: client.id,
            client_name: client.full_name.presence || client.name || "-",
            authorized_hours: client.ihss_authorized_hours&.to_f,
          }
        end
      end

      pairs.values.sort_by { |row| [row[:employee_name].to_s.downcase, row[:client_name].to_s.downcase] }
    end
  end
end
