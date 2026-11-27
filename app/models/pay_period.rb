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
#  slug            :string           not null
#  starts_at       :datetime
#  status          :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_pay_periods_on_slug                   (slug) UNIQUE
#  index_pay_periods_on_starts_at_and_ends_at  (starts_at,ends_at) UNIQUE
#
class PayPeriod < ApplicationRecord
  include PgSearchable

  pg_search_config(against: [:starts_at, :ends_at, :status, :approved_at, :period_type, :config_snapshot])

  resourcify

  has_many :timesheets, dependent: :destroy
  has_many :adjustments, class_name: "Payroll::Adjustment", dependent: :destroy, inverse_of: :pay_period

  before_validation :assign_slug_from_starts_at, on: :create
  after_create :sync_shifts!

  before_destroy :prevent_destroy_when_locked, prepend: true

  scope :includes_associated, -> { includes(:timesheets) }
  scope :recent_first, -> { order(ends_at: :desc) }

  def to_param
    slug
  end

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

    existing = where(starts_at: start_t.all_day).order(:created_at, :starts_at).first
    return existing if existing

    create!(starts_at: start_t, ends_at: end_t)
  end

  def self.shifts_overlapping_period(pay_period)
    event_ids = Calendar::Event
      .for_schedule_range(pay_period.starts_at, pay_period.ends_at)
      .select(:id)

    Shift.where(calendar_event_id: event_ids)
  end

  def shift_occurrences(shifts)
    rows = Array(shifts).flat_map { |shift| shift.occurrences_in(self) }
      .sort_by { |row| [row.starts_at, row.id.to_s] }
    Payroll::ShiftOccurrence.preload_approvals!(rows)
    Payroll::ShiftOccurrence.preload_overrides!(rows)
  end

  def self.attach_shift!(shift)
    return if shift.employee_id.blank?

    shift_date = shift.start_time&.to_date
    return if shift_date.blank?

    period_start, period_end = Payroll::Period.period_dates(shift_date)
    pay_period = for_period_dates(period_start, period_end)
    timesheet = pay_period.timesheets.find_or_create_by!(employee_id: shift.employee_id)
    timesheet.update!(approved_at: nil) if timesheet.approved_at.present?
    shift.clear_facilitator_approval! if shift.facilitator_approved?
    return pay_period if shift.timesheet_id == timesheet.id

    shift.update_column(:timesheet_id, timesheet.id) # rubocop:disable Rails/SkipsModelValidations
    pay_period
  end

  def sync_shifts!
    shifts_in_range = self.class.shifts_overlapping_period(self)
    return if shifts_in_range.empty?

    recurring_event_ids = Calendar::Event.joins(:recurring_patterns).select(:id)

    shifts_in_range.distinct.pluck(:employee_id).compact.each do |employee_id|
      timesheet = timesheets.find_or_create_by!(employee_id: employee_id)
      employee_shifts = shifts_in_range.where(employee_id: employee_id)
      attachable = employee_shifts.where.not(calendar_event_id: recurring_event_ids)
      misplaced = attachable.left_outer_joins(:timesheet).where(
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

  def assign_slug_from_starts_at
    return if starts_at.blank?

    self.slug = starts_at.to_date.iso8601
  end

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
