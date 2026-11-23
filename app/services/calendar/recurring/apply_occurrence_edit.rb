# frozen_string_literal: true

module Calendar
  module Recurring
    class ApplyOccurrenceEdit
      def self.call(event, attrs:, edit_scope:, occurrence_starts_at: nil)
        new(event, attrs:, edit_scope:, occurrence_starts_at:).call
      end

      def initialize(event, attrs:, edit_scope:, occurrence_starts_at:)
        @event = event
        @attrs = attrs
        @edit_scope = edit_scope.to_s
        @occurrence_starts_at = parse_time(occurrence_starts_at)
      end

      def call
        case @edit_scope
        when "one"
          edit_one!
        when "future"
          edit_future!
        else
          edit_all!
        end
        @event
      end

      private

      def edit_all!
        form_starts_at = parse_time(@attrs[:starts_at]) || @event.starts_at
        form_ends_at = parse_time(@attrs[:ends_at]) || @event.ends_at
        duration = form_ends_at - form_starts_at
        series_starts_at, series_ends_at = series_times_for_all(form_starts_at, duration)

        update_attrs = @attrs.except(:edit_scope, :occurrence_starts_at, :recurring_patterns_attributes)
        update_attrs[:starts_at] = series_starts_at
        update_attrs[:ends_at] = series_ends_at

        ActiveRecord::Base.transaction do
          @event.update!(update_attrs)
          replace_patterns!(@attrs[:recurring_patterns_attributes]) if pattern_attrs_provided?
        end
      end

      def series_times_for_all(form_starts_at, duration)
        if @occurrence_starts_at.present?
          delta = form_starts_at - @occurrence_starts_at
          series_starts_at = @event.starts_at + delta
          return [series_starts_at, series_starts_at + duration]
        end

        if @event.recurring_patterns.any?
          series_starts_at = @event.starts_at.change(
            hour: form_starts_at.hour,
            min: form_starts_at.min,
            sec: form_starts_at.sec,
          )
          return [series_starts_at, series_starts_at + duration]
        end

        [form_starts_at, form_starts_at + duration]
      end

      def edit_one!
        raise ArgumentError, "occurrence_starts_at is required" if @occurrence_starts_at.blank?

        form_starts_at = parse_time(@attrs[:starts_at]) || @occurrence_starts_at
        form_ends_at = parse_time(@attrs[:ends_at]) || (@occurrence_starts_at + series_duration)

        ActiveRecord::Base.transaction do
          @event.event_exceptions.create!(
            cancelled: @occurrence_starts_at,
          )

          build_detached_event(form_starts_at, form_ends_at).save!
        end
      end

      def edit_future!
        raise ArgumentError, "occurrence_starts_at is required" if @occurrence_starts_at.blank?
        return edit_all! if @event.recurring_patterns.empty? && !pattern_attrs_provided?
        return edit_all! if same_instant?(@occurrence_starts_at, @event.starts_at)

        form_starts_at = parse_time(@attrs[:starts_at]) || @occurrence_starts_at
        form_ends_at = parse_time(@attrs[:ends_at]) || (@occurrence_starts_at + series_duration)
        continuation_patterns = if pattern_attrs_provided?
                                  normalize_pattern_attrs(@attrs[:recurring_patterns_attributes])
                                else
                                  @event.recurring_patterns.map { |pattern| pattern_snapshot(pattern) }
                                end

        ActiveRecord::Base.transaction do
          TruncateSeriesBefore.call(@event, occurrence_starts_at: @occurrence_starts_at)
          build_continuation_event(
            form_starts_at,
            form_ends_at,
            continuation_patterns,
            from_form: pattern_attrs_provided?,
          ).save!
        end
      end

      def build_continuation_event(form_starts_at, form_ends_at, source_patterns, from_form:)
        continuation = build_event_shell(form_starts_at, form_ends_at)
        copy_participants_to!(continuation)
        copy_shift_to!(continuation)

        source_patterns.each do |pattern|
          attrs = if from_form
                    pattern
                  else
                    continuation_pattern_attrs(pattern, form_starts_at, source_patterns.size)
                  end
          continuation.recurring_patterns.build(attrs)
        end

        continuation
      end

      def replace_patterns!(pattern_attrs)
        @event.recurring_patterns.destroy_all
        normalize_pattern_attrs(pattern_attrs).each do |attrs|
          @event.recurring_patterns.create!(attrs)
        end
      end

      def pattern_attrs_provided?
        @attrs.key?(:recurring_patterns_attributes)
      end

      def normalize_pattern_attrs(pattern_attrs)
        Array(pattern_attrs).filter_map do |raw|
          next if raw.blank?

          attrs = raw.to_h.deep_symbolize_keys
          attrs = attrs.except(:id, :_destroy, :calendar_event_id, :created_at, :updated_at)
          next if attrs[:recurring_type].blank?

          attrs
        end
      end

      def pattern_snapshot(pattern)
        {
          recurring_type: pattern.recurring_type,
          offset: pattern.offset,
          day_of_week: pattern.day_of_week,
          day_of_month: pattern.day_of_month,
          week_of_month: pattern.week_of_month,
          month_of_year: pattern.month_of_year,
          end_date: pattern.end_date,
          max_occurrences: pattern.max_occurrences,
        }
      end

      def build_detached_event(form_starts_at, form_ends_at)
        detached = build_event_shell(form_starts_at, form_ends_at)
        copy_participants_to!(detached)
        copy_shift_to!(detached)
        detached
      end

      def build_event_shell(form_starts_at, form_ends_at)
        Calendar::Event.new(
          name: @attrs[:name].presence || @event.name,
          starts_at: form_starts_at,
          ends_at: form_ends_at,
          all_day: @attrs.key?(:all_day) ? @attrs[:all_day] : @event.all_day,
          category_id: @attrs[:category_id].presence || @event.category_id,
        )
      end

      def copy_participants_to!(target)
        @event.event_participants.each do |participant|
          target.event_participants.build(
            participant_id: participant.participant_id,
            participant_type: participant.participant_type,
          )
        end
      end

      def copy_shift_to!(target)
        shift_attrs = @attrs[:shift_attributes]
        return unless shift_attrs || @event.shift

        employee_id = if shift_attrs
                        shift_attrs[:employee_id]
                      else
                        @event.shift.employee_id
                      end
        service_type_id = if shift_attrs&.key?(:service_type_id)
                            shift_attrs[:service_type_id]
                          else
                            @event.shift&.service_type_id
                          end
        target.build_shift(
          employee_id: employee_id.presence,
          service_type_id: service_type_id.presence,
        )
      end

      def continuation_pattern_attrs(pattern, form_starts_at, pattern_count)
        attrs = {
          recurring_type: pattern[:recurring_type],
          offset: pattern[:offset],
          day_of_week: pattern[:day_of_week],
          day_of_month: pattern[:day_of_month],
          week_of_month: pattern[:week_of_month],
          month_of_year: pattern[:month_of_year],
          end_date: continuation_end_date(pattern[:end_date], form_starts_at),
          max_occurrences: pattern[:max_occurrences],
        }

        case pattern[:recurring_type]
        when "weekly"
          if pattern_count == 1
            attrs[:day_of_week] = form_starts_at.wday
          end
        when "monthly"
          if pattern[:week_of_month].present?
            attrs[:day_of_week] = form_starts_at.wday
            attrs[:week_of_month] = nth_weekday_of_month(form_starts_at)
            attrs[:day_of_month] = nil
          else
            attrs[:day_of_month] = form_starts_at.day
          end
        when "yearly"
          attrs[:month_of_year] = form_starts_at.month
          attrs[:day_of_month] = form_starts_at.day
        end

        attrs
      end

      def continuation_end_date(end_date, form_starts_at)
        return if end_date.blank?
        return if end_date < form_starts_at.to_date

        end_date
      end

      def nth_weekday_of_month(time)
        ((time.day - 1) / 7) + 1
      end

      def series_duration
        @event.ends_at - @event.starts_at
      end

      def same_instant?(left, right)
        left.to_i == right.to_i
      end

      def parse_time(value)
        return if value.blank?
        return value if value.acts_like?(:time)

        Time.zone.parse(value.to_s)
      end
    end
  end
end
