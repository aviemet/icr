require "rails_helper"

RSpec.describe Payroll::FinalizeEligibility do
  describe ".call" do
    it "blocks finalize before the period ends" do
      pay_period = build(
        :pay_period,
        ends_at: 2.days.from_now.end_of_day,
        finalized_at: nil,
      )
      summary = { total_count: 1, pending_count: 0 }

      result = described_class.call(pay_period, summary: summary)

      expect(result[:can_finalize]).to be(false)
      expect(result[:finalize_blocked_reason]).to eq("before_period_end")
      expect(result[:can_approve]).to be(true)
      expect(result[:can_export]).to be(false)
    end

    it "blocks finalize when approvals remain after the period ends" do
      pay_period = build(
        :pay_period,
        ends_at: 2.days.ago.end_of_day,
        finalized_at: nil,
      )
      summary = { total_count: 2, pending_count: 1 }

      result = described_class.call(pay_period, summary: summary)

      expect(result[:can_finalize]).to be(false)
      expect(result[:finalize_blocked_reason]).to eq("pending_approvals")
    end

    it "allows finalize when the period is ended and every timesheet is approved" do
      pay_period = build(
        :pay_period,
        ends_at: 2.days.ago.end_of_day,
        finalized_at: nil,
      )
      summary = { total_count: 2, pending_count: 0 }

      result = described_class.call(pay_period, summary: summary)

      expect(result[:can_finalize]).to be(true)
      expect(result[:finalize_blocked_reason]).to be_nil
    end

    it "blocks finalize when the period is already finalized" do
      pay_period = build(
        :pay_period,
        ends_at: 2.days.ago.end_of_day,
        finalized_at: 1.day.ago,
      )
      summary = { total_count: 1, pending_count: 0 }

      result = described_class.call(pay_period, summary: summary)

      expect(result[:can_finalize]).to be(false)
      expect(result[:finalize_blocked_reason]).to eq("already_finalized")
      expect(result[:can_approve]).to be(false)
      expect(result[:can_export]).to be(true)
    end

    it "blocks finalize when there are no timesheets" do
      pay_period = build(
        :pay_period,
        ends_at: 2.days.ago.end_of_day,
        finalized_at: nil,
      )
      summary = { total_count: 0, pending_count: 0 }

      result = described_class.call(pay_period, summary: summary)

      expect(result[:can_finalize]).to be(false)
      expect(result[:finalize_blocked_reason]).to eq("no_timesheets")
    end
  end
end
