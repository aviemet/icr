# frozen_string_literal: true

require "rails_helper"

RSpec.describe Payroll::ShiftExceptions do
  let(:employee) { create(:employee) }
  let(:category) { create(:category, slug: "shift") }

  def build_shift(starts_at, ends_at)
    event = create(:calendar_event, starts_at: starts_at, ends_at: ends_at)
    create(:shift, employee: employee, calendar_event: event, category: category)
  end

  describe ".call" do
    it "returns zero count and empty reasons when no shifts overlap" do
      shift1 = build_shift(1.day.ago.at_noon, 1.day.ago.at_noon + 8.hours)
      shift2 = build_shift(2.days.ago.at_noon, 2.days.ago.at_noon + 8.hours)
      shifts = [shift1, shift2]

      result = described_class.call(shifts)

      expect(result[:exception_count]).to eq(0)
      expect(result[:reasons_by_shift_id]).to eq({})
    end

    it "returns count and reasons when two shifts overlap" do
      base = 1.day.ago.at_noon
      shift1 = build_shift(base, base + 8.hours)
      shift2 = build_shift(base + 4.hours, base + 12.hours)
      shifts = [shift1, shift2]

      result = described_class.call(shifts)

      expect(result[:exception_count]).to eq(2)
      expect(result[:reasons_by_shift_id].keys).to contain_exactly(shift1.id.to_s, shift2.id.to_s)
      expect(result[:reasons_by_shift_id].values.flatten).to all(include("Overlaps with shift"))
    end
  end
end
