# frozen_string_literal: true

module Payroll
  class FinalizeEligibility
    def self.call(pay_period, summary:)
      new(pay_period, summary: summary).call
    end

    def initialize(pay_period, summary:)
      @pay_period = pay_period
      @summary = summary
    end

    def call
      reason = blocked_reason
      {
        can_finalize: reason.nil?,
        finalize_blocked_reason: reason,
        can_approve: !@pay_period.finalized?,
        can_export: @pay_period.finalized?,
      }
    end

    def blocked_reason
      return "already_finalized" if @pay_period.finalized?
      return "before_period_end" if Date.current <= @pay_period.ends_at.to_date
      return "no_timesheets" if @summary[:total_count].to_i <= 0
      return "pending_approvals" if @summary[:pending_count].to_i.positive?

      nil
    end
  end
end
