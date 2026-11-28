# frozen_string_literal: true

module Payroll
  module Hours
    class Classifier
      Label = Data.define(:kind, :hours, :interval_id, :date, :consuming_client_id)

      def self.call(segments:, policy:, workweek_start:, co_employer:)
        new(
          segments: segments,
          policy: policy,
          workweek_start: workweek_start,
          co_employer: co_employer,
        ).call
      end

      def initialize(segments:, policy:, workweek_start:, co_employer:)
        @segments = segments
        @policy = policy
        @workweek_start = workweek_start.to_sym
        @co_employer = co_employer
      end

      def call
        leave_segments, work_segments = @segments.partition(&:leave?)
        labels = leave_segments.map do |segment|
          Label.new(
            kind: leave_bucket(segment.leave_kind),
            hours: segment.hours,
            interval_id: segment.interval_id,
            date: segment.date,
            consuming_client_id: nil,
          )
        end

        agency_segments, external_segments = work_segments.partition { |segment| ot_eligible?(segment) }
        external_segments.each do |segment|
          labels << Label.new(
            kind: :ihss_external,
            hours: segment.hours,
            interval_id: segment.interval_id,
            date: segment.date,
            consuming_client_id: segment.consuming_client_id,
          )
        end

        exempt, ot_pool = agency_segments.partition(&:criteria_exempt?)
        exempt.each do |segment|
          labels << Label.new(
            kind: :regular,
            hours: segment.hours,
            interval_id: segment.interval_id,
            date: segment.date,
            consuming_client_id: segment.consuming_client_id,
          )
        end

        labels.concat(classify_ot_pool(ot_pool))
      end

      private

      def ot_eligible?(segment)
        return true if @co_employer

        !segment.ihss?
      end

      def leave_bucket(kind)
        case kind
        when :pto then :pto
        when :sick then :sick
        when :holiday then :holiday
        else :regular
        end
      end

      def classify_ot_pool(segments)
        return [] if segments.empty?

        by_date = segments.group_by(&:date)
        seventh_days = seventh_consecutive_days(by_date.keys)
        straight = []
        labels = []

        by_date.keys.sort.each do |date|
          day_segments = by_date[date].sort_by { |segment| [segment.starts_at.to_i, segment.interval_id.to_s] }

          if seventh_days.include?(date)
            labels.concat(label_seventh_day(day_segments))
            next
          end

          day_total = 0.0
          day_segments.each do |segment|
            split_daily(segment, day_total).each do |kind, hours|
              next unless hours.positive?

              if kind == :regular
                straight << {
                  interval_id: segment.interval_id,
                  date: date,
                  hours: hours,
                  starts_at: segment.starts_at,
                  consuming_client_id: segment.consuming_client_id,
                }
              else
                labels << Label.new(
                  kind: kind,
                  hours: hours,
                  interval_id: segment.interval_id,
                  date: date,
                  consuming_client_id: segment.consuming_client_id,
                )
              end
            end
            day_total += segment.hours
          end
        end

        labels.concat(label_weekly(straight))
        labels
      end

      def split_daily(segment, day_total)
        remaining = segment.hours
        cursor = day_total
        results = []
        daily_ot_after = @policy.daily_ot_after
        daily_dt_after = @policy.daily_double_time_after

        if cursor < daily_ot_after
          take = [remaining, daily_ot_after - cursor].min
          results << [:regular, take]
          remaining -= take
          cursor += take
        end

        if remaining.positive? && cursor < daily_dt_after
          take = [remaining, daily_dt_after - cursor].min
          results << [:ot, take]
          remaining -= take
        end

        if remaining.positive?
          results << [(@policy.double_time? ? :double_time : :ot), remaining]
        end

        results
      end

      def label_seventh_day(day_segments)
        labels = []
        day_total = 0.0

        day_segments.each do |segment|
          remaining = segment.hours
          cursor = day_total

          seventh_day_dt_after = @policy.seventh_day_double_time_after
          if cursor < seventh_day_dt_after
            take = [remaining, seventh_day_dt_after - cursor].min
            labels << Label.new(
              kind: :ot,
              hours: take,
              interval_id: segment.interval_id,
              date: segment.date,
              consuming_client_id: segment.consuming_client_id,
            )
            remaining -= take
          end

          if remaining.positive?
            labels << Label.new(
              kind: :double_time,
              hours: remaining,
              interval_id: segment.interval_id,
              date: segment.date,
              consuming_client_id: segment.consuming_client_id,
            )
          end

          day_total += segment.hours
        end

        labels
      end

      def label_weekly(straight_segments)
        by_week = straight_segments.group_by { |row| row[:date].beginning_of_week(@workweek_start) }
        threshold = @policy.weekly_ot_after
        labels = []

        by_week.each_value do |rows|
          ordered = rows.sort_by { |row| [row[:date], row[:starts_at].to_i, row[:interval_id].to_s] }
          week_total = 0.0

          ordered.each do |row|
            hours = row[:hours]
            if week_total >= threshold
              labels << Label.new(
                kind: :ot,
                hours: hours,
                interval_id: row[:interval_id],
                date: row[:date],
                consuming_client_id: row[:consuming_client_id],
              )
            elsif week_total + hours > threshold
              weekly_ot = week_total + hours - threshold
              regular = hours - weekly_ot
              if regular.positive?
                labels << Label.new(
                  kind: :regular,
                  hours: regular,
                  interval_id: row[:interval_id],
                  date: row[:date],
                  consuming_client_id: row[:consuming_client_id],
                )
              end
              labels << Label.new(
                kind: :ot,
                hours: weekly_ot,
                interval_id: row[:interval_id],
                date: row[:date],
                consuming_client_id: row[:consuming_client_id],
              )
            else
              labels << Label.new(
                kind: :regular,
                hours: hours,
                interval_id: row[:interval_id],
                date: row[:date],
                consuming_client_id: row[:consuming_client_id],
              )
            end
            week_total += hours
          end
        end

        labels
      end

      def seventh_consecutive_days(dates)
        return Set.new unless @policy.seventh_day_premiums?

        worked = dates.to_set
        result = Set.new

        worked.map { |date| date.beginning_of_week(@workweek_start) }.uniq.each do |week_start|
          streak = 0
          (0..6).each do |offset|
            day = week_start + offset.days
            if worked.include?(day)
              streak += 1
              result << day if streak >= 7
            else
              streak = 0
            end
          end
        end

        result
      end
    end
  end
end
