# frozen_string_literal: true

module TimeOff
  class RecordManagerLeave
    class Error < StandardError; end

    def self.call(employee:, kind:, starts_at:, ends_at:, hours:, user: nil)
      new(
        employee: employee,
        kind: kind,
        starts_at: starts_at,
        ends_at: ends_at,
        hours: hours,
        user: user,
      ).call
    end

    def initialize(employee:, kind:, starts_at:, ends_at:, hours:, user:)
      @employee = employee
      @kind = kind.to_s
      @starts_at = starts_at
      @ends_at = ends_at
      @hours = hours.to_d
      @user = user
    end

    def call
      raise Error, "invalid kind" unless %w[pto sick].include?(@kind)
      raise Error, "hours must be positive" unless @hours.positive?

      service_type_slug = @kind == "pto" ? "vacation" : "sick"

      ActiveRecord::Base.transaction do
        shift_starts = coerce_time(@starts_at)
        shift_ends = shift_starts + @hours.to_f.hours
        shift = CreateLeaveShift.call(
          employee: @employee,
          service_type_slug: service_type_slug,
          starts_at: shift_starts,
          ends_at: shift_ends,
          name: "#{@kind.upcase} leave",
        )

        TimeOff::Request.create!(
          employee: @employee,
          kind: @kind,
          starts_at: shift_starts,
          ends_at: shift_ends,
          hours: @hours,
          status: :approved,
          reviewed_at: Time.current,
          review_note: "Recorded by manager",
          shift: shift,
        )
      end
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
