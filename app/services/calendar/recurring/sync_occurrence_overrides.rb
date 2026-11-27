# frozen_string_literal: true

module Calendar
  module Recurring
    class SyncOccurrenceOverrides
      def self.snapshot(shift)
        return [] if shift.blank?

        ShiftOccurrenceOverride.where(shift_id: shift.id).map do |row|
          {
            occurrence_starts_at: row.occurrence_starts_at,
            ihss: row.ihss,
            service_type_id: row.service_type_id,
          }
        end
      end

      def self.restore_remapped(shift, snapshot:, delta:)
        return if shift.blank?

        clear_all(shift)
        Array(snapshot).each do |attrs|
          slot = attrs[:occurrence_starts_at]
          slot += delta if delta.present? && !delta.to_i.zero?
          ShiftOccurrenceOverride.create!(
            shift_id: shift.id,
            occurrence_starts_at: ShiftOccurrenceOverride.normalize_occurrence_starts_at(slot),
            ihss: attrs[:ihss],
            service_type_id: attrs[:service_type_id],
          )
        end
      end

      def self.delete_slot(shift, occurrence_starts_at)
        return if shift.blank? || occurrence_starts_at.blank?

        slot = ShiftOccurrenceOverride.normalize_occurrence_starts_at(occurrence_starts_at)
        ShiftOccurrenceOverride.where(shift_id: shift.id, occurrence_starts_at: slot).delete_all
      end

      def self.clear_all(shift)
        return if shift.blank?

        ShiftOccurrenceOverride.where(shift_id: shift.id).delete_all
      end

      def self.delete_from(shift, occurrence_starts_at:)
        return if shift.blank? || occurrence_starts_at.blank?

        slot = ShiftOccurrenceOverride.normalize_occurrence_starts_at(occurrence_starts_at)
        ShiftOccurrenceOverride
          .where(shift_id: shift.id)
          .where(occurrence_starts_at: slot..)
          .delete_all
      end

      def self.purge_unexpanded(shift, event:)
        return if shift.blank? || event.blank?

        range_start = event.starts_at
        return if range_start.blank?

        range_end = range_start + 5.years
        expanded = ExpandOccurrences.call(
          event: event,
          range_start: range_start,
          range_end: range_end,
        )
        keep = expanded.to_set { |occurrence|
          ShiftOccurrenceOverride.normalize_occurrence_starts_at(occurrence.original_starts_at)
        }

        ShiftOccurrenceOverride.where(shift_id: shift.id).find_each do |row|
          next if keep.include?(ShiftOccurrenceOverride.normalize_occurrence_starts_at(row.occurrence_starts_at))

          row.destroy!
        end
      end
    end
  end
end
