# frozen_string_literal: true

module Payroll
  module Hours
    class PeriodWindow
      Result = Data.define(:before, :within, :after)

      def self.for(pay_period)
        new(
          starts_at: pay_period.starts_at.to_date.in_time_zone.beginning_of_day,
          ends_at: (pay_period.ends_at.to_date + 1.day).in_time_zone.beginning_of_day,
        )
      end

      attr_reader :starts_at, :ends_at

      def initialize(starts_at:, ends_at:)
        @starts_at = starts_at
        @ends_at = ends_at
      end

      def clip(intervals)
        before = []
        within = []
        after = []

        intervals.each do |interval|
          next if interval.starts_at.blank? || interval.ends_at.blank?

          before << piece(interval, interval.starts_at, [interval.ends_at, @starts_at].min)
          within << piece(interval, [interval.starts_at, @starts_at].max, [interval.ends_at, @ends_at].min)
          after << piece(interval, [interval.starts_at, @ends_at].max, interval.ends_at)
        end

        Result.new(before: before.compact, within: within.compact, after: after.compact)
      end

      private

      def piece(interval, starts_at, ends_at)
        return if starts_at >= ends_at
        return interval if starts_at == interval.starts_at && ends_at == interval.ends_at

        WorkInterval.new(**interval.to_h, starts_at: starts_at, ends_at: ends_at)
      end
    end
  end
end
