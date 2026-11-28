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
        @window = PeriodWindow.for(pay_period)
        @workweek_start = Setting.overtime_workweek_start.to_sym
        @co_employer = Setting.ihss_co_employer
        @exemptions = OvertimeExemption.where(active: true).to_a
      end

      def call
        return {} if @employee_ids.empty?

        collected = @collector.intervals_for(
          pay_period: @pay_period,
          employee_ids: @employee_ids,
          range_start: lookback_starts_at,
          range_end: @pay_period.ends_at,
        )
        policies = policies_by_employee_id

        classified_intervals(collected)
          .group_by(&:employee_id)
          .each_with_object({}) do |(employee_id, intervals), hash|
            segments = SegmentBuilder.call(intervals)
            labels = Classifier.call(
              segments: segments,
              policy: policies[employee_id] || Policy::Standard.new,
              workweek_start: @workweek_start,
              co_employer: @co_employer,
            )
            report = PeriodReport.call(
              labels: labels,
              segments: segments,
              period_start: @period_start,
              period_end: @period_end,
            )
            hash[employee_id.to_s] = report.to_h
          end
      end

      private

      def classified_intervals(collected)
        clipped = @window.clip(collected.map { |interval| with_exemption(interval) })
        lookback = IhssHourClassifier.call(pay_period: lookback_pay_period, intervals: clipped.before)
        in_period = IhssHourClassifier.call(pay_period: @pay_period, intervals: clipped.within)
        lookback + in_period
      end

      def with_exemption(interval)
        exempt = @exemptions.any? { |exemption| exemption.matches?(interval) }
        WorkInterval.new(**interval.to_h, criteria_exempt: exempt)
      end

      def lookback_starts_at
        week_start = @period_start.beginning_of_week(@workweek_start)
        Time.zone.local(week_start.year, week_start.month, week_start.day).beginning_of_day
      end

      def lookback_pay_period
        return if lookback_starts_at >= @window.starts_at

        PayPeriod.where("starts_at <= :time AND ends_at >= :time", time: lookback_starts_at).first
      end

      def policies_by_employee_id
        Employee.where(id: @employee_ids).pluck(:id, :overtime_policy).to_h.transform_values { |name|
          Policy.for(name)
        }
      end
    end
  end
end
