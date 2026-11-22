# frozen_string_literal: true

module Payroll
  class ClientScopeForUser
    def self.call(user:, period:)
      new(user: user, period: period).call
    end

    def initialize(user:, period:)
      @user = user
      @period = period
      @employee = user.person&.employee
    end

    def call
      active_client_ids = clients_with_shifts
      return Client.none if active_client_ids.empty?

      if admin?
        return Client.where(id: active_client_ids)
      end

      return Client.none unless @employee

      if timesheet_index?
        Client.where(id: active_client_ids)
      else
        managed_ids = @employee.managed_clients.where(id: active_client_ids).select(:id)
        Client.where(id: managed_ids)
      end
    end

    private

    def admin?
      @user.has_role?(:admin)
    end

    def timesheet_index?
      return false if @employee.blank?

      job_title = @employee.job_title
      return false if job_title.blank?

      job_title.has_role?(:index, Timesheet)
    end

    def clients_with_shifts
      PayPeriod.shifts_overlapping_period(@period)
        .assigned
        .joins(calendar_event: :event_participants)
        .where(event_participants: { participant_type: "Client" })
        .distinct
        .pluck("event_participants.participant_id")
    end
  end
end
