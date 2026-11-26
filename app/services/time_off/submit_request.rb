# frozen_string_literal: true

module TimeOff
  class SubmitRequest
    class Error < StandardError; end

    def self.call(employee:, kind:, starts_at:, ends_at:, hours:)
      new(
        employee: employee,
        kind: kind,
        starts_at: starts_at,
        ends_at: ends_at,
        hours: hours,
      ).call
    end

    def initialize(employee:, kind:, starts_at:, ends_at:, hours:)
      @employee = employee
      @kind = kind.to_s
      @starts_at = starts_at
      @ends_at = ends_at
      @hours = hours.to_d
    end

    def call
      raise Error, "invalid kind" unless %w[pto sick].include?(@kind)
      raise Error, "hours must be positive" unless @hours.positive?

      starts = coerce_time(@starts_at)
      ends = starts + @hours.to_f.hours

      TimeOff::Request.create!(
        employee: @employee,
        kind: @kind,
        starts_at: starts,
        ends_at: ends,
        hours: @hours,
        status: :pending,
      )
    end

    private

    def coerce_time(value)
      case value
      when ActiveSupport::TimeWithZone, Time
        value.in_time_zone
      when Date
        value.in_time_zone
      else
        Time.zone.parse(value.to_s) || raise(Error, "invalid starts_at")
      end
    end
  end
end
