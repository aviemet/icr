# frozen_string_literal: true

module Payroll
  class ShiftOccurrence < SimpleDelegator
    def self.interval_id(shift_id, occurrence)
      return shift_id.to_s unless occurrence.recurring

      interval_id_for(
        shift_id,
        occurrence.original_starts_at,
        recurring: true,
      )
    end

    def self.interval_id_for(shift_id, occurrence_starts_at, recurring:)
      return shift_id.to_s unless recurring

      normalized = ShiftOccurrenceApproval.normalize_occurrence_starts_at(occurrence_starts_at)
      "#{shift_id}:#{normalized.iso8601(3)}"
    end

    def self.lookup_key(shift_id, occurrence_starts_at)
      ShiftOccurrenceOverride.lookup_key(shift_id, occurrence_starts_at)
    end

    def self.preload_approvals!(occurrences)
      list = Array(occurrences)
      return list if list.empty?

      shift_ids = list.map(&:shift_id).uniq
      approvals = ShiftOccurrenceApproval.map_for_shift_ids(shift_ids)
      list.each do |occurrence|
        key = ShiftOccurrenceApproval.lookup_key(
          occurrence.shift_id,
          occurrence.occurrence_starts_at,
        )
        occurrence.bind_approval(approvals[key])
      end
      list
    end

    def self.preload_overrides!(occurrences)
      list = Array(occurrences)
      return list if list.empty?

      shift_ids = list.map(&:shift_id).uniq
      overrides = ShiftOccurrenceOverride.map_for_shift_ids(shift_ids)
      list.each do |occurrence|
        key = ShiftOccurrenceOverride.lookup_key(
          occurrence.shift_id,
          occurrence.occurrence_starts_at,
        )
        occurrence.bind_override(overrides[key])
      end
      list
    end

    def initialize(shift, occurrence)
      super(shift)
      @occurrence = occurrence
      @approval = nil
      @approval_bound = false
      @override = nil
      @override_bound = false
    end

    def id
      self.class.interval_id(__getobj__.id, @occurrence)
    end

    def shift_id
      __getobj__.id
    end

    delegate :starts_at, to: :@occurrence

    delegate :ends_at, to: :@occurrence

    def start_time
      starts_at
    end

    def end_time
      ends_at
    end

    def occurrence_starts_at
      @occurrence.original_starts_at
    end

    def recurring_occurrence?
      @occurrence.recurring
    end

    def bind_approval(approval)
      @approval = approval
      @approval_bound = true
      self
    end

    def bind_override(override)
      @override = override
      @override_bound = true
      self
    end

    def facilitator_approved_at
      approval_record&.facilitator_approved_at
    end

    def facilitator_approved?
      facilitator_approved_at.present?
    end

    def ihss
      record = override_record
      return record.ihss unless record.nil? || record.ihss.nil?

      __getobj__.ihss
    end

    def service_type_id
      record = override_record
      return record.service_type_id if record&.service_type_id.present?

      __getobj__.service_type_id
    end

    def service_type
      record = override_record
      return record.service_type if record&.service_type_id.present?

      __getobj__.service_type
    end

    def render(view = nil, options: {})
      __getobj__.serializer(view).render(self, options)
    end

    def serializer(view = nil)
      __getobj__.serializer(view)
    end

    private

    def approval_record
      return @approval if @approval_bound

      @approval = ShiftOccurrenceApproval.find_by(
        shift_id: shift_id,
        occurrence_starts_at: ShiftOccurrenceApproval.normalize_occurrence_starts_at(occurrence_starts_at),
      )
      @approval_bound = true
      @approval
    end

    def override_record
      return @override if @override_bound

      @override = ShiftOccurrenceOverride.find_by(
        shift_id: shift_id,
        occurrence_starts_at: ShiftOccurrenceOverride.normalize_occurrence_starts_at(occurrence_starts_at),
      )
      @override_bound = true
      @override
    end
  end
end
