# frozen_string_literal: true

module Payroll
  class UnreviewedShifts
    def self.call(timesheet)
      new(timesheet).call
    end

    def initialize(timesheet)
      @timesheet = timesheet
    end

    def call
      return [] if @timesheet.blank?

      @timesheet.shifts
        .facilitator_pending
        .includes(calendar_event: { clients: :person })
        .joins(:calendar_event)
        .order("calendar_events.starts_at")
        .map { |shift| serialize(shift) }
    end

    private

    def serialize(shift)
      clients = shift.calendar_event&.clients || []
      {
        id: shift.id.to_s,
        starts_at: shift.starts_at&.iso8601,
        client_names: clients.map(&:full_name).compact,
      }
    end
  end
end
