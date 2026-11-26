# frozen_string_literal: true

require "rails_helper"

RSpec.describe Payroll::ShiftOccurrence do
  describe ".interval_id / lookup_key alignment" do
    it "hashes expand original_starts_at to the same slot as override normalize" do
      shift_id = SecureRandom.uuid
      raw = Time.zone.parse("2024-03-11 09:00:00.000456 -07:00")
      occurrence = Struct.new(:recurring, :original_starts_at).new(true, raw)

      interval_id = described_class.interval_id(shift_id, occurrence)
      normalized = ShiftOccurrenceOverride.normalize_occurrence_starts_at(raw)
      expect(interval_id).to eq("#{shift_id}:#{normalized.iso8601(3)}")

      key_from_expand = described_class.lookup_key(shift_id, raw)
      key_from_param = described_class.lookup_key(shift_id, raw.iso8601(3))
      key_from_slot = ShiftOccurrenceOverride.lookup_key(shift_id, normalized)

      expect(key_from_expand).to eq(key_from_param)
      expect(key_from_expand).to eq(key_from_slot)
    end

    it "uses the bare shift id for non-recurring occurrences" do
      shift_id = SecureRandom.uuid
      occurrence = Struct.new(:recurring, :original_starts_at).new(false, Time.current)

      expect(described_class.interval_id(shift_id, occurrence)).to eq(shift_id.to_s)
      expect(described_class.interval_id_for(shift_id, Time.current, recurring: false)).to eq(shift_id.to_s)
    end
  end
end
