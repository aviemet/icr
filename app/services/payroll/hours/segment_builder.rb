# frozen_string_literal: true

module Payroll
  module Hours
    class SegmentBuilder
      def self.call(intervals)
        new(intervals).call
      end

      def initialize(intervals)
        @intervals = intervals
      end

      def call
        @intervals.flat_map { |interval| segments_for(interval) }
      end

      private

      def segments_for(interval)
        hours_by_date(interval).map do |date, hours|
          Segment.new(
            interval_id: interval.id.presence&.to_s,
            employee_id: interval.employee_id,
            date: date,
            hours: hours,
            starts_at: interval.starts_at,
            ihss: interval.ihss?,
            consuming_client_id: interval.try(:consuming_client_id),
            criteria_exempt: interval.criteria_exempt == true,
            leave_kind: interval.leave_kind,
            category: interval.category,
          )
        end
      end

      def hours_by_date(interval)
        start_time = interval.start_time
        end_time = interval.end_time
        return {} if start_time.blank? || end_time.blank?

        start_sec = start_time.to_i
        end_sec = end_time.to_i
        start_date = start_time.to_date
        end_date = end_time.to_date
        return {} if start_date > end_date

        result = {}
        (start_date..end_date).each do |current_date|
          day_begin = Time.zone.local(current_date.year, current_date.month, current_date.day, 0, 0, 0)
          day_end_t = day_begin.end_of_day
          day_start_sec = [start_sec, day_begin.to_i].max
          day_end_sec = [end_sec, day_end_t.to_i].min
          next if day_start_sec >= day_end_sec

          result[current_date] = (day_end_sec - day_start_sec) / 3600.0
        end

        result
      end
    end
  end
end
