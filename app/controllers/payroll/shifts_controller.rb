# frozen_string_literal: true

class Payroll::ShiftsController < ApplicationController
  expose :shift, scope: -> { Shift.includes(calendar_event: :clients, timesheet: :pay_period) }

  # @route POST /payroll/shifts/:id/approve (approve_shift)
  def approve
    authorize shift, :facilitator_approve?

    period = shift.timesheet&.pay_period
    if period&.finalized?
      redirect_back_or_to(fallback_period_path(period), alert: t("pay_periods.finalized_locked"))
      return
    end

    shift.update!(facilitator_approved_at: Time.current)
    redirect_back_or_to(fallback_period_path(period), notice: t("shifts.facilitator_approved"))
  end

  # @route POST /payroll/shifts/:id/unapprove (unapprove_shift)
  def unapprove
    authorize shift, :facilitator_unapprove?

    period = shift.timesheet&.pay_period
    if period&.finalized?
      redirect_back_or_to(fallback_period_path(period), alert: t("pay_periods.finalized_locked"))
      return
    end

    shift.update!(facilitator_approved_at: nil)
    redirect_back_or_to(fallback_period_path(period), notice: t("shifts.facilitator_unapproved"))
  end

  # @route POST /payroll/shifts/bulk_approve (bulk_approve_shifts)
  def bulk_approve
    period = PayPeriod.find(params.require(:pay_period_id))
    authorize period, :show?

    if period.finalized?
      redirect_to period_path(period), alert: t("pay_periods.finalized_locked")
      return
    end

    client_id = params[:client_id].presence
    scope = PayPeriod.shifts_overlapping_period(period).assigned.facilitator_pending
    if client_id.present?
      scope = scope
        .joins(calendar_event: :event_participants)
        .where(
          event_participants: {
            participant_type: "Client",
            participant_id: client_id,
          },
        )
    end

    ids = params[:shift_ids].presence || (params[:approve_all] ? scope.distinct.pluck("shifts.id") : [])
    approved = 0
    Shift.where(id: ids).includes(calendar_event: :clients, timesheet: :pay_period).find_each do |row|
      authorize row, :facilitator_approve?
      next if row.facilitator_approved?

      row.update!(facilitator_approved_at: Time.current)
      approved += 1
    rescue Pundit::NotAuthorizedError
      next
    end

    redirect_back_or_to(
      client_id.present? ? client_period_path(period, client_id) : clients_period_path(period),
      notice: t("shifts.bulk_facilitator_approved", count: approved),
    )
  end

  private

  def fallback_period_path(period)
    return payroll_periods_path if period.blank?

    period_path(period)
  end
end
