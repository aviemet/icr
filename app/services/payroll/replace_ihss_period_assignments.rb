# frozen_string_literal: true

module Payroll
  class ReplaceIhssPeriodAssignments
    class AuthorizationExceeded < StandardError
      attr_reader :client_id, :authorized_hours, :assigned_hours

      def initialize(client_id:, authorized_hours:, assigned_hours:)
        @client_id = client_id
        @authorized_hours = authorized_hours
        @assigned_hours = assigned_hours
        super("IHSS assignments exceed authorized hours for client #{client_id}")
      end
    end

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
        assigned_by_client = Hash.new(0.0)

        @rows.each do |row|
          employee_id = row[:employee_id].presence || row["employee_id"]
          client_id = row[:client_id].presence || row["client_id"]
          hours = row[:hours].presence || row["hours"]
          next if employee_id.blank? || client_id.blank?

          hours_value = hours.to_f
          assignment = Payroll::IhssPeriodAssignment.find_or_initialize_by(
            pay_period_id: @period.id,
            employee_id: employee_id,
            client_id: client_id,
          )

          if hours_value.negative? || hours_value.zero?
            assignment.destroy! if assignment.persisted?
            next
          end

          assignment.hours = hours_value
          assignment.save!
          keep_ids << assignment.id
          assigned_by_client[client_id.to_s] += hours_value
        end

        assert_authorized!(assigned_by_client)

        Payroll::IhssPeriodAssignment
          .where(pay_period_id: @period.id)
          .where.not(id: keep_ids)
          .find_each(&:destroy!)
      end
    end

    private

    def assert_authorized!(assigned_by_client)
      return if assigned_by_client.empty?

      Client.where(id: assigned_by_client.keys).find_each do |client|
        authorized = client.ihss_authorized_hours
        next if authorized.blank?

        assigned = assigned_by_client[client.id.to_s]
        next if assigned <= authorized.to_f

        raise AuthorizationExceeded.new(
          client_id: client.id,
          authorized_hours: authorized.to_f,
          assigned_hours: assigned,
        )
      end
    end
  end
end
