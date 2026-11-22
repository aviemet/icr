# frozen_string_literal: true

module Calendar
  module Recurring
    class ExpandOccurrences
      Occurrence = Struct.new(
        :event,
        :original_starts_at,
        :starts_at,
        :ends_at,
        :recurring,
        keyword_init: true,
      )

      def self.call(event:, range_start:, range_end:)
        new(event:, range_start:, range_end:).call
      end

      def self.for_events(events:, range_start:, range_end:)
        Array(events).flat_map do |event|
          call(event:, range_start:, range_end:)
        end
      end

      def initialize(event:, range_start:, range_end:)
        @event = event
        @range_start = range_start
        @range_end = range_end
      end

      def call
        return [] if @event.starts_at.blank? || @event.ends_at.blank?

        patterns = Array(@event.recurring_patterns)
        return non_recurring_occurrence if patterns.empty?

        duration = @event.ends_at - @event.starts_at
        exceptions = Array(@event.event_exceptions)
        starts = occurrence_starts_for_patterns(@event.starts_at, patterns)

        starts.filter_map do |original_starts_at|
          next if cancelled?(exceptions, original_starts_at)

          display_start, display_end = display_times(exceptions, original_starts_at, duration)
          Occurrence.new(
            event: @event,
            original_starts_at: original_starts_at,
            starts_at: display_start,
            ends_at: display_end,
            recurring: true,
          )
        end
      end

      private

      def non_recurring_occurrence
        return [] unless @event.starts_at < @range_end && @event.ends_at > @range_start

        [
          Occurrence.new(
            event: @event,
            original_starts_at: @event.starts_at,
            starts_at: @event.starts_at,
            ends_at: @event.ends_at,
            recurring: false,
          ),
        ]
      end

      def occurrence_starts_for_patterns(master_start, patterns)
        offset = [patterns.map { |pattern| pattern.offset.to_i }.max, 1].max
        series_end = series_end_from_patterns(patterns)
        max_occurrences = max_occurrences_from_patterns(patterns)
        type = patterns.first.recurring_type

        case type
        when "daily"
          daily_starts(master_start, offset, series_end, max_occurrences)
        when "weekly"
          weekdays = patterns.filter_map(&:day_of_week)
          weekly_starts(master_start, weekdays, offset, series_end, max_occurrences)
        when "monthly"
          nth = patterns.find { |pattern| pattern.week_of_month.present? && pattern.day_of_week.present? }
          if nth
            monthly_nth_weekday_starts(
              master_start,
              nth.day_of_week,
              nth.week_of_month,
              offset,
              series_end,
              max_occurrences,
            )
          else
            day_of_month = patterns.find { |pattern| pattern.day_of_month.present? }&.day_of_month
            return [] if day_of_month.blank?

            monthly_day_starts(master_start, day_of_month, offset, series_end, max_occurrences)
          end
        when "yearly"
          pattern = patterns.first
          return [] if pattern.month_of_year.blank? || pattern.day_of_month.blank?

          yearly_starts(
            master_start,
            pattern.month_of_year,
            pattern.day_of_month,
            offset,
            series_end,
            max_occurrences,
          )
        else
          []
        end
      end

      def series_end_from_patterns(patterns)
        end_dates = patterns.filter_map(&:end_date)
        return nil if end_dates.empty?

        end_dates.min.end_of_day
      end

      def max_occurrences_from_patterns(patterns)
        counts = patterns.filter_map { |pattern| pattern.max_occurrences if pattern.max_occurrences.to_i.positive? }
        return nil if counts.empty?

        counts.min
      end

      def daily_starts(master_start, offset, series_end, max_occurrences)
        starts = []
        cursor = master_start
        count = 0
        step = [offset, 1].max

        while cursor < @range_end
          break if series_end && cursor > series_end
          break if max_occurrences && count >= max_occurrences

          starts << cursor if in_visible_range?(cursor, master_start)
          count += 1
          cursor += step.days
        end

        starts
      end

      def weekly_starts(master_start, weekdays, offset, series_end, max_occurrences)
        starts = []
        master_week_start = master_start.to_date.beginning_of_week(:sunday)
        cursor = master_start.to_date
        range_end_day = @range_end.to_date
        count = 0

        while cursor <= range_end_day
          break if series_end && cursor.to_time > series_end
          break if max_occurrences && count >= max_occurrences

          if weekdays.include?(cursor.wday)
            weeks = ((cursor.beginning_of_week(:sunday) - master_week_start) / 7).to_i
            on_interval = offset <= 1 || (weeks >= 0 && (weeks % offset).zero?)
            if on_interval
              occurrence = at_master_clock(cursor, master_start)
              if occurrence >= master_start
                count += 1
                break if max_occurrences && count > max_occurrences

                starts << occurrence if in_visible_range?(occurrence, master_start)
              end
            end
          end

          cursor += 1.day
        end

        starts
      end

      def monthly_day_starts(master_start, day_of_month, offset, series_end, max_occurrences)
        starts = []
        cursor = master_start.to_date.beginning_of_month
        count = 0
        step = [offset, 1].max

        while cursor < (@range_end.to_date + 32.days)
          break if series_end && cursor.to_time > series_end
          break if max_occurrences && count >= max_occurrences

          day = [day_of_month, cursor.end_of_month.day].min
          occurrence = at_master_clock(Date.new(cursor.year, cursor.month, day), master_start)
          if occurrence >= master_start
            count += 1
            break if max_occurrences && count > max_occurrences

            starts << occurrence if in_visible_range?(occurrence, master_start)
          end
          cursor = (cursor + step.months).beginning_of_month
        end

        starts
      end

      def monthly_nth_weekday_starts(master_start, day_of_week, week_of_month, offset, series_end, max_occurrences)
        starts = []
        cursor = master_start.to_date.beginning_of_month
        count = 0
        step = [offset, 1].max

        while cursor < (@range_end.to_date + 32.days)
          break if series_end && cursor.to_time > series_end
          break if max_occurrences && count >= max_occurrences

          occurrence_day = nth_weekday_in_month(cursor, day_of_week, week_of_month)
          if occurrence_day.nil?
            cursor = (cursor + step.months).beginning_of_month
            next
          end

          occurrence = at_master_clock(occurrence_day, master_start)
          if occurrence >= master_start
            count += 1
            break if max_occurrences && count > max_occurrences

            starts << occurrence if in_visible_range?(occurrence, master_start)
          end
          cursor = (cursor + step.months).beginning_of_month
        end

        starts
      end

      def yearly_starts(master_start, month_of_year, day_of_month, offset, series_end, max_occurrences)
        starts = []
        year = master_start.year
        count = 0
        step = [offset, 1].max

        while year <= @range_end.year + 1
          break if max_occurrences && count >= max_occurrences

          month_start = Date.new(year, month_of_year, 1)
          if series_end && month_start.to_time > series_end && count.positive? && (month_start.to_time > series_end)
            break
          end

          day = [day_of_month, month_start.end_of_month.day].min
          occurrence = at_master_clock(Date.new(year, month_of_year, day), master_start)
          if occurrence >= master_start
            count += 1
            break if max_occurrences && count > max_occurrences
            break if series_end && occurrence > series_end

            starts << occurrence if in_visible_range?(occurrence, master_start)
          end
          year += step
        end

        starts
      end

      def nth_weekday_in_month(month_start, day_of_week, week_of_month)
        if week_of_month.negative?
          walk = month_start.end_of_month
          walk -= 1.day while walk.wday != day_of_week
          return walk
        end

        walk = month_start
        walk += 1.day while walk.wday != day_of_week
        occurrence_day = walk + ((week_of_month - 1) * 7).days
        return nil if occurrence_day.month != month_start.month

        occurrence_day
      end

      def at_master_clock(day, master_start)
        Time.zone.local(
          day.year,
          day.month,
          day.day,
          master_start.hour,
          master_start.min,
          master_start.sec,
        )
      end

      def in_visible_range?(occurrence, master_start)
        occurrence >= master_start &&
          occurrence < @range_end &&
          (occurrence + 1.second) > @range_start
      end

      def cancelled?(exceptions, original_starts_at)
        exceptions.any? do |exception|
          exception.cancelled.present? && same_instant?(exception.cancelled, original_starts_at)
        end
      end

      def display_times(exceptions, original_starts_at, duration)
        reschedule = exceptions.find do |exception|
          exception.rescheduled.present? && same_instant?(exception.rescheduled, original_starts_at)
        end

        if reschedule&.starts_at.present? && reschedule.ends_at.present?
          [reschedule.starts_at, reschedule.ends_at]
        elsif reschedule&.starts_at.present?
          [reschedule.starts_at, reschedule.starts_at + duration]
        else
          [original_starts_at, original_starts_at + duration]
        end
      end

      def same_instant?(left, right)
        left.to_i == right.to_i
      end
    end
  end
end
