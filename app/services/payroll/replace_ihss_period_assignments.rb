# frozen_string_literal: true

module Payroll
  class ReplaceIhssPeriodAssignments
    def self.call(period:, rows:)
      new(period: period, rows: rows).call
    end

    def initialize(period:, rows:)
      @period = period
      @rows = Array(rows)
    end

    def call
      raise ArgumentError, "period finalized" if @period.finalized?

      ActiveRecord::Base.transaction do
        keep_ids = []
        @rows.each do |row|
          employee_id = row[:employee_id].presence || row["employee_id"]
          client_id = row[:client_id].presence || row["client_id"]
          hours = row[:hours].presence || row["hours"]
          next if employee_id.blank? || client_id.blank?

          hours_value = hours.to_f
          next if hours_value.negative?

          assignment = Payroll::IhssPeriodAssignment.find_or_initialize_by(
            pay_period_id: @period.id,
            employee_id: employee_id,
            client_id: client_id,
          )
          if hours_value.zero?
            assignment.destroy! if assignment.persisted?
            next
          end

          assignment.hours = hours_value
          assignment.save!
          keep_ids << assignment.id
        end

        Payroll::IhssPeriodAssignment
          .where(pay_period_id: @period.id)
          .where.not(id: keep_ids)
          .find_each(&:destroy!)
      end
    end
  end
end
