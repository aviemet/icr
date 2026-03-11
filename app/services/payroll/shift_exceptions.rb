# frozen_string_literal: true

module Payroll
  class ShiftExceptions
    def self.call(shifts)
      new(shifts).call
    end

    def initialize(shifts)
      @shifts = shifts.to_a
    end

    def call
      {
        exception_count: overlapping_shift_ids.size,
        reasons_by_shift_id: reasons_by_shift_id,
      }
    end

    private

    attr_reader :shifts

    def overlapping_shift_ids
      @overlapping_shift_ids ||= begin
        ids = Set.new

        shifts.each_with_index do |shift_a, i|
          shifts[(i + 1)..].each do |shift_b|
            next unless overlap?(shift_a, shift_b)

            ids << shift_a.id << shift_b.id
          end
        end

        ids
      end
    end

    def overlap?(shift_a, shift_b)
      start_a = shift_a.start_time
      end_a = shift_a.end_time
      start_b = shift_b.start_time
      end_b = shift_b.end_time

      return false if start_a.blank? || end_a.blank? || start_b.blank? || end_b.blank?

      start_a < end_b && end_a > start_b
    end

    def reasons_by_shift_id
      result = Hash.new { |h, k| h[k] = [] }

      overlapping_shift_ids.each do |shift_id|
        shift = shifts.find { |s| s.id == shift_id }
        next unless shift

        overlapping = shifts.select { |s| s.id != shift.id && overlap?(shift, s) }
        overlapping.each do |other|
          result[shift_id.to_s] << I18n.t("payroll.shift_exceptions.overlap", time: other.start_time&.strftime("%m/%d %I:%M %p"))
        end
      end
      result.to_h
    end
  end
end
