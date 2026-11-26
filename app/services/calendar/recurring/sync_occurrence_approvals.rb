# frozen_string_literal: true

module Calendar
  module Recurring
    class SyncOccurrenceApprovals
      def self.snapshot(shift)
        return [] if shift.blank?

        ShiftOccurrenceApproval.where(shift_id: shift.id).map do |row|
          {
            occurrence_starts_at: row.occurrence_starts_at,
            facilitator_approved_at: row.facilitator_approved_at,
          }
        end
      end

      def self.restore_remapped(shift, snapshot:, delta:)
        return if shift.blank?

        clear_all(shift)
        Array(snapshot).each do |attrs|
          slot = attrs[:occurrence_starts_at]
          slot += delta if delta.present? && !delta.to_i.zero?
          ShiftOccurrenceApproval.create!(
            shift_id: shift.id,
            occurrence_starts_at: ShiftOccurrenceApproval.normalize_occurrence_starts_at(slot),
            facilitator_approved_at: attrs[:facilitator_approved_at],
          )
        end
      end

      def self.delete_slot(shift, occurrence_starts_at)
        return if shift.blank? || occurrence_starts_at.blank?

        ShiftOccurrenceApproval.unapprove!(shift: shift, occurrence_starts_at: occurrence_starts_at)
      end

      def self.clear_all(shift)
        return if shift.blank?

        ShiftOccurrenceApproval.where(shift_id: shift.id).delete_all
        clear_legacy_column!(shift)
      end

      def self.delete_from(shift, occurrence_starts_at:)
        return if shift.blank? || occurrence_starts_at.blank?

        slot = ShiftOccurrenceApproval.normalize_occurrence_starts_at(occurrence_starts_at)
        ShiftOccurrenceApproval
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
        keep = expanded.map { |occurrence|
          ShiftOccurrenceApproval.normalize_occurrence_starts_at(occurrence.original_starts_at)
        }.to_set

        ShiftOccurrenceApproval.where(shift_id: shift.id).find_each do |row|
          next if keep.include?(ShiftOccurrenceApproval.normalize_occurrence_starts_at(row.occurrence_starts_at))

          row.destroy!
        end
      end

      def self.clear_legacy_column!(shift)
        return unless shift.has_attribute?(:facilitator_approved_at)
        return if shift[:facilitator_approved_at].blank?

        shift.update_column(:facilitator_approved_at, nil) # rubocop:disable Rails/SkipsModelValidations
      end
      private_class_method :clear_legacy_column!
    end
  end
end
