# frozen_string_literal: true

module Payroll
  module Hours
    class Engine
      def self.call(pay_period, employee_ids, collector: WorkIntervalCollectors::ScheduledShifts.new)
        new(pay_period, employee_ids, collector: collector).call
      end

      def initialize(pay_period, employee_ids, collector:)
        @pay_period = pay_period
        @employee_ids = Array(employee_ids)
        @collector = collector
        @period_start = pay_period.starts_at.to_date
        @period_end = pay_period.ends_at.to_date
        @workweek_start = Setting.overtime_workweek_start.to_sym
        @co_employer = Setting.ihss_co_employer
        @exemptions = OvertimeExemption.where(active: true).to_a
      end

      def call
        return {} if @employee_ids.empty?

        range_start = lookback_starts_at
        range_end = @pay_period.ends_at
        collected = @collector.intervals_for(
          pay_period: @pay_period,
          employee_ids: @employee_ids,
          range_start: range_start,
          range_end: range_end,
        )
        classified_intervals = IhssHourClassifier.call(
          pay_period: @pay_period,
          intervals: collected,
        )
        policies = policies_by_employee_id

        classified_intervals
          .group_by(&:employee_id)
          .each_with_object({}) do |(employee_id, intervals), hash|
            segments = SegmentBuilder.call(intervals, exemptions: @exemptions)
            classification = Classifier.call(
              segments: segments,
              policy: policies[employee_id] || Policy::Standard.new,
              workweek_start: @workweek_start,
              co_employer: @co_employer,
            )
            in_period = segments.select { |segment| segment.date.between?(@period_start, @period_end) }
            report = PeriodReport.call(
              classification: classification,
              period_start: @period_start,
              period_end: @period_end,
              in_period_segments: in_period,
              co_employer: @co_employer,
              all_segments: segments,
            )
            hash[employee_id.to_s] = report.to_h
          end
      end

      private

      def lookback_starts_at
        week_start = @period_start.beginning_of_week(@workweek_start)
        Time.zone.local(week_start.year, week_start.month, week_start.day).beginning_of_day
      end

      def policies_by_employee_id
        Employee.where(id: @employee_ids).pluck(:id, :overtime_policy).to_h.transform_values { |name|
          Policy.for(name)
        }
      end
    end
  end
end
