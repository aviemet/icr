# == Schema Information
#
# Table name: pay_periods
#
#  id              :uuid             not null, primary key
#  approved_at     :datetime
#  config_snapshot :jsonb
#  ends_at         :datetime
#  finalized_at    :datetime
#  period_type     :integer
#  starts_at       :datetime
#  status          :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_pay_periods_on_starts_at_and_ends_at  (starts_at,ends_at) UNIQUE
#
class PayPeriod < ApplicationRecord
  include PgSearchable

  pg_search_config(against: [:starts_at, :ends_at, :status, :approved_at, :period_type, :config_snapshot])

  resourcify

  has_many :timesheets, dependent: :destroy
  has_many :adjustments, class_name: "Payroll::Adjustment", dependent: :destroy, inverse_of: :pay_period

  after_create :sync_shifts!

  before_destroy :prevent_destroy_when_locked, prepend: true

  scope :includes_associated, -> { includes(:timesheets) }
  scope :recent_first, -> { order(ends_at: :desc) }

  def finalized?
    finalized_at.present?
  end

  def finalize!(user)
    if finalized?
      errors.add(:base, "already finalized")
      raise ActiveRecord::RecordInvalid, self
    end

    summary = Payroll::PeriodSummary.call(self)
    PaperTrail.request(whodunnit: user.id) do
      update!(
        finalized_at: Time.current,
        config_snapshot: {
          finalized_summary: summary.except(:exception_counts),
          payroll_period_type: Setting.payroll_period_type,
        },
      )
    end
  end

  def record_export!(user)
    unless finalized?
      errors.add(:base, "must be finalized")
      raise ActiveRecord::RecordInvalid, self
    end

    versions.create!(
      event: "export",
      whodunnit: user.id.to_s,
    )
  end

  def record_adjustment!(user:, reason:, change_set:, timesheet: nil, employee: nil, &block)
    unless finalized?
      errors.add(:base, "must be finalized")
      raise ActiveRecord::RecordInvalid, self
    end

    transaction do
      adjustment = adjustments.create!(
        user: user,
        reason: reason,
        change_set: change_set,
        timesheet: timesheet,
        employee: employee,
      )
      block&.call(adjustment)
      adjustment
    end
  end

  def self.for_period_dates(period_start_date, period_end_date)
    start_t = period_start_date.to_time.beginning_of_day
    end_t = period_end_date.to_time.end_of_day

    same_start = where(starts_at: start_t.all_day).order(:starts_at)
    if same_start.exists?
      base = same_start.first
      transaction do
        base.update!(starts_at: start_t, ends_at: end_t)

        ids_to_merge = same_start.where.not(id: base.id).pluck(:id)
        if ids_to_merge.any?
          # We are only reassigning the pay_period_id foreign key for timesheets being merged into the base period.
          # No per-record validations or callbacks are needed here, and running them would make this merge significantly slower.
          Timesheet.where(pay_period_id: ids_to_merge).update_all(pay_period_id: base.id) # rubocop:disable Rails/SkipsModelValidations
          where(id: ids_to_merge).delete_all
        end

        base.reattach_out_of_range_shifts!
      end
      return base
    end

    transaction do
      created = create!(starts_at: start_t, ends_at: end_t)

      where.not(id: created.id).where("starts_at < ? AND ends_at >= ?", start_t, start_t).find_each do |other|
        other.update!(ends_at: start_t - 1.second)
        other.reattach_out_of_range_shifts!
      end

      previous = where.not(id: created.id).where(ends_at: ...created.starts_at).order(ends_at: :desc).first
      if previous && previous.ends_at < created.starts_at - 1.second
        previous.update!(ends_at: created.starts_at - 1.second)
      end

      following = where.not(id: created.id).where("starts_at > ?", created.ends_at).order(:starts_at).first
      if following && following.starts_at > created.ends_at + 1.second
        following.update!(starts_at: created.ends_at + 1.second)
      end

      created
    end
  end

  def self.shifts_overlapping_period(pay_period)
    Shift.joins(:calendar_event).where(
      "calendar_events.starts_at <= ? AND calendar_events.ends_at >= ?",
      pay_period.ends_at,
      pay_period.starts_at,
    )
  end

  def self.attach_shift!(shift)
    shift_date = shift.start_time&.to_date
    return if shift_date.blank?

    period_start, period_end = Payroll::Period.period_dates(shift_date)
    pay_period = for_period_dates(period_start, period_end)
    timesheet = pay_period.timesheets.find_or_create_by!(employee_id: shift.employee_id)
    return pay_period if shift.timesheet_id == timesheet.id

    shift.update_column(:timesheet_id, timesheet.id) # rubocop:disable Rails/SkipsModelValidations
    pay_period
  end

  def sync_shifts!
    shifts_in_range = self.class.shifts_overlapping_period(self)
    return if shifts_in_range.empty?

    shifts_in_range.distinct.pluck(:employee_id).each do |employee_id|
      timesheet = timesheets.find_or_create_by!(employee_id: employee_id)
      employee_shifts = shifts_in_range.where(employee_id: employee_id)
      misplaced = employee_shifts.left_outer_joins(:timesheet).where(
        "shifts.timesheet_id IS NULL OR timesheets.pay_period_id IS DISTINCT FROM ?",
        id,
      )
      next if misplaced.empty?

      # We are bulk attaching existing shifts to their employee's timesheet by setting timesheet_id only.
      # Skipping validations and callbacks keeps this operation efficient and avoids re-running business logic on historical shifts.
      misplaced.update_all(timesheet_id: timesheet.id) # rubocop:disable Rails/SkipsModelValidations
    end
  end

  def reattach_out_of_range_shifts!
    Shift.joins(:timesheet, :calendar_event)
      .where(timesheets: { pay_period_id: id })
      .find_each do |shift|
        shift_date = shift.start_time&.to_date
        next if shift_date.blank?
        next if shift_date.between?(starts_at.to_date, ends_at.to_date)

        self.class.attach_shift!(shift)
      end
  end

  private

  def prevent_destroy_when_locked
    if finalized?
      errors.add(:base, "cannot delete a finalized pay period")
      throw :abort
    end

    return unless timesheets.where.not(approved_at: nil).exists?

    errors.add(:base, "cannot delete pay period with approved timesheets")
    throw :abort
  end
end
