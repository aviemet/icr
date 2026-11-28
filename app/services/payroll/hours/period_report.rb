# frozen_string_literal: true

module Payroll
  module Hours
    class PeriodReport
      def self.call(classification:, period_start:, period_end:, in_period_segments:, co_employer:, all_segments:)
        new(
          classification: classification,
          period_start: period_start,
          period_end: period_end,
          in_period_segments: in_period_segments,
          co_employer: co_employer,
          all_segments: all_segments,
        ).call
      end

      def initialize(classification:, period_start:, period_end:, in_period_segments:, co_employer:, all_segments:)
        @classification = classification
        @period_start = period_start
        @period_end = period_end
        @in_period_segments = in_period_segments
        @co_employer = co_employer
        @all_segments = all_segments
      end

      def call
        in_period_ids = @in_period_segments.filter_map(&:interval_id).to_set
        out_of_period_ids = @all_segments.filter_map(&:interval_id).to_set - in_period_ids

        shift_ot = @classification.shift_ot_hours.slice(*in_period_ids)
        shift_dt = @classification.shift_double_time_hours.slice(*in_period_ids)

        out_ot = out_of_period_ids.sum { |interval_id| @classification.shift_ot_hours[interval_id].to_f }
        out_dt = out_of_period_ids.sum { |interval_id| @classification.shift_double_time_hours[interval_id].to_f }
        ot_hours = [@classification.ot_hours - out_ot, 0.0].max
        double_time_hours = [@classification.double_time_hours - out_dt, 0.0].max

        in_period_work = @in_period_segments.reject(&:leave?)
        ihss_hours = in_period_work.select(&:ihss?).sum(&:hours)
        company_hours = in_period_work.reject(&:ihss?).sum(&:hours)

        client_ihss = Hash.new(0.0)
        in_period_work.select(&:ihss?).each do |segment|
          next if segment.consuming_client_id.blank?

          client_ihss[segment.consuming_client_id.to_s] += segment.hours
        end

        leave = @in_period_segments.select(&:leave?)
        pto = leave.select { |segment| segment.leave_kind == :pto }.sum(&:hours)
        sick = leave.select { |segment| segment.leave_kind == :sick }.sum(&:hours)
        holiday = leave.select { |segment| segment.leave_kind == :holiday }.sum(&:hours)

        premium_pool = in_period_work.reject(&:criteria_exempt?).select { |segment|
          @co_employer || !segment.ihss?
        }
        exempt_hours = in_period_work.select(&:criteria_exempt?).sum(&:hours)
        premium_hours = premium_pool.sum(&:hours)
        regular_hours = [premium_hours - ot_hours - double_time_hours, 0.0].max + exempt_hours

        Classification.new(
          regular_hours: round(regular_hours),
          ot_hours: round(ot_hours),
          double_time_hours: round(double_time_hours),
          shift_ot_hours: shift_ot.transform_values { |hours| round(hours) },
          shift_double_time_hours: shift_dt.transform_values { |hours| round(hours) },
          ihss_hours: round(ihss_hours),
          company_hours: round(company_hours),
          pto_hours: round(pto),
          sick_hours: round(sick),
          holiday_hours: round(holiday),
          client_ihss_hours: client_ihss.transform_values { |hours| round(hours) },
        )
      end

      private

      def round(hours)
        hours.to_f.round(2)
      end
    end
  end
end
