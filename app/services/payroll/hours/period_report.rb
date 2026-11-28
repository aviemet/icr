# frozen_string_literal: true

module Payroll
  module Hours
    class PeriodReport
      def self.call(labels:, segments:, period_start:, period_end:)
        new(labels: labels, segments: segments, period_start: period_start, period_end: period_end).call
      end

      def initialize(labels:, segments:, period_start:, period_end:)
        @period = period_start..period_end
        @labels = labels.select { |label| @period.cover?(label.date) }
        @segments = segments.select { |segment| @period.cover?(segment.date) }
      end

      def call
        totals = Hash.new(0.0)
        shift_ot = Hash.new(0.0)
        shift_dt = Hash.new(0.0)

        work_segments = @segments.reject(&:leave?)
        work_segments.each do |segment|
          next if segment.interval_id.blank?

          shift_ot[segment.interval_id] = 0.0
          shift_dt[segment.interval_id] = 0.0
        end

        @labels.each do |label|
          totals[label.kind] += label.hours
          next if label.interval_id.blank?

          case label.kind
          when :ot then shift_ot[label.interval_id] += label.hours
          when :double_time then shift_dt[label.interval_id] += label.hours
          end
        end

        client_ihss = Hash.new(0.0)
        work_segments.select(&:ihss?).each do |segment|
          next if segment.consuming_client_id.blank?

          client_ihss[segment.consuming_client_id.to_s] += segment.hours
        end

        Classification.new(
          regular_hours: round(totals[:regular]),
          ot_hours: round(totals[:ot]),
          double_time_hours: round(totals[:double_time]),
          shift_ot_hours: shift_ot.transform_values { |hours| round(hours) },
          shift_double_time_hours: shift_dt.transform_values { |hours| round(hours) },
          ihss_hours: round(work_segments.select(&:ihss?).sum(&:hours)),
          company_hours: round(work_segments.reject(&:ihss?).sum(&:hours)),
          pto_hours: round(totals[:pto]),
          sick_hours: round(totals[:sick]),
          holiday_hours: round(totals[:holiday]),
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
