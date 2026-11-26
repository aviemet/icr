# frozen_string_literal: true

class Payroll::ShiftsController < ApplicationController
  expose :shift, scope: -> { Shift.includes(calendar_event: :clients, timesheet: :pay_period) }

  # @route POST /payroll/shifts/:id/approve (approve_shift)
  def approve
    authorize shift, :facilitator_approve?

    period = action_period
    if period&.finalized?
      redirect_back_or_to(fallback_period_path(period), alert: t("pay_periods.finalized_locked"))
      return
    end

    occurrence_starts_at = occurrence_starts_at_param
    if occurrence_starts_at.blank?
      redirect_back_or_to(fallback_period_path(period), alert: t("shifts.occurrence_required"))
      return
    end

    ShiftOccurrenceApproval.approve!(shift: shift, occurrence_starts_at: occurrence_starts_at)
    redirect_back_or_to(fallback_period_path(period), notice: t("shifts.facilitator_approved"))
  end

  # @route POST /payroll/shifts/:id/unapprove (unapprove_shift)
  def unapprove
    authorize shift, :facilitator_unapprove?

    period = action_period
    if period&.finalized?
      redirect_back_or_to(fallback_period_path(period), alert: t("pay_periods.finalized_locked"))
      return
    end

    occurrence_starts_at = occurrence_starts_at_param
    if occurrence_starts_at.blank?
      redirect_back_or_to(fallback_period_path(period), alert: t("shifts.occurrence_required"))
      return
    end

    ShiftOccurrenceApproval.unapprove!(shift: shift, occurrence_starts_at: occurrence_starts_at)
    redirect_back_or_to(fallback_period_path(period), notice: t("shifts.facilitator_unapproved"))
  end

  # @route PATCH /payroll/shifts/:id/ihss (ihss_shift)
  def update_ihss
    authorize shift, :update_ihss?

    period = action_period
    if period.blank? || period.finalized?
      return render_ihss_failure(t("pay_periods.finalized_locked"), period)
    end

    if Setting.ihss_assignment_mode != Setting::IHSS_ASSIGNMENT_MODES[:shift]
      return render_ihss_failure(t("shifts.ihss_shift_mode_required"), period)
    end

    occurrence_starts_at = occurrence_starts_at_param
    if occurrence_starts_at.blank?
      return render_ihss_failure(t("shifts.occurrence_required"), period)
    end

    override = ShiftOccurrenceOverride.set_ihss!(
      shift: shift,
      occurrence_starts_at: occurrence_starts_at,
      ihss: params.require(:ihss),
    )

    delta = Payroll::IhssToggleRefresh.call(
      pay_period: period,
      shift: shift,
      occurrence_starts_at: occurrence_starts_at,
      ihss: override.ihss == true,
      client_id: params[:client_id],
    )
    render json: delta
  end

  # @route PATCH /payroll/shifts/:id/service_type (service_type_shift)
  # @route PATCH /payroll/shifts/:id/category (category_shift)
  def update_service_type
    authorize shift, :update_service_type?

    period = action_period
    if period.blank? || period.finalized?
      redirect_back_or_to(fallback_period_path(period), alert: t("pay_periods.finalized_locked"))
      return
    end

    occurrence_starts_at = occurrence_starts_at_param
    if occurrence_starts_at.blank?
      redirect_back_or_to(fallback_period_path(period), alert: t("shifts.occurrence_required"))
      return
    end

    id_or_slug = params[:service_type_id].presence || params[:category_id].presence
    service_type = ServiceType.active.find_by(id: id_or_slug) ||
      ServiceType.active.find_by!(slug: id_or_slug)
    ShiftOccurrenceOverride.set_service_type!(
      shift: shift,
      occurrence_starts_at: occurrence_starts_at,
      service_type: service_type,
    )
    redirect_back_or_to(fallback_period_path(period), notice: t("shifts.service_type_updated"))
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
    targets = bulk_approval_targets(period, client_id)
    approved = 0

    targets.each do |target|
      row = Shift.includes(calendar_event: :clients, timesheet: :pay_period).find_by(id: target[:shift_id])
      next if row.blank?

      authorize row, :facilitator_approve?
      ShiftOccurrenceApproval.approve!(
        shift: row,
        occurrence_starts_at: target[:occurrence_starts_at],
      )
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

  def action_period
    requested_id = params[:pay_period_id].presence
    if requested_id.present?
      period = PayPeriod.find_by(id: requested_id)
      return period if period.present?
    end

    shift.timesheet&.pay_period
  end

  def fallback_period_path(period)
    return payroll_periods_path if period.blank?

    period_path(period)
  end

  def occurrence_starts_at_param
    raw = params[:occurrence_starts_at].presence
    return ShiftOccurrenceApproval.normalize_occurrence_starts_at(raw) if raw.present?
    return if shift.calendar_event&.recurring_patterns&.any?

    shift.calendar_event&.starts_at
  end

  def render_ihss_failure(message, period)
    respond_to do |format|
      format.json { render json: { error: message }, status: :unprocessable_content }
      format.any { redirect_back_or_to(fallback_period_path(period), alert: message) }
    end
  end

  def bulk_approval_targets(period, client_id)
    explicit = Array(params[:approvals]).filter_map do |raw|
      attrs = raw.respond_to?(:permit) ? raw.permit(:shift_id, :occurrence_starts_at) : raw
      shift_id = attrs[:shift_id].presence || attrs["shift_id"].presence
      occurrence_starts_at = attrs[:occurrence_starts_at].presence || attrs["occurrence_starts_at"].presence
      next if shift_id.blank? || occurrence_starts_at.blank?

      {
        shift_id: shift_id,
        occurrence_starts_at: ShiftOccurrenceApproval.normalize_occurrence_starts_at(occurrence_starts_at),
      }
    end
    return explicit if explicit.any?

    if ActiveModel::Type::Boolean.new.cast(params[:approve_all])
      scope = PayPeriod.shifts_overlapping_period(period).assigned
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
      occurrences = period.shift_occurrences(scope.includes(calendar_event: [:recurring_patterns, :event_exceptions]).distinct.to_a)
      return occurrences.reject(&:facilitator_approved?).map { |occurrence|
        {
          shift_id: occurrence.shift_id,
          occurrence_starts_at: occurrence.occurrence_starts_at,
        }
      }
    end

    shift_ids = Array(params[:shift_ids])
    occurrence_starts_ats = Array(params[:occurrence_starts_ats])
    shift_ids.each_with_index.filter_map do |shift_id, index|
      occurrence_starts_at = occurrence_starts_ats[index]
      next if shift_id.blank? || occurrence_starts_at.blank?

      {
        shift_id: shift_id,
        occurrence_starts_at: ShiftOccurrenceApproval.normalize_occurrence_starts_at(occurrence_starts_at),
      }
    end
  end
end
