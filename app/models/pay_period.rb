# == Schema Information
#
# Table name: pay_periods
#
#  id              :uuid             not null, primary key
#  approved_at     :datetime
#  config_snapshot :jsonb
#  ends_at         :datetime
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

  tracked
  resourcify

  has_many :timesheets, dependent: :destroy

  after_create :backfill_timesheets_from_shifts

  before_destroy :prevent_destroy_with_approved_timesheets, prepend: true

  scope :includes_associated, -> { includes(:timesheets) }

  def self.for_period_dates(period_start_date, period_end_date)
    start_t = period_start_date.to_time.beginning_of_day
    end_t = period_end_date.to_time.end_of_day

    overlapping = where("starts_at <= ? AND ends_at >= ?", end_t, start_t).order(:starts_at)
    if overlapping.exists?
      base = overlapping.first
      transaction do
        new_starts_at = [base.starts_at, start_t].min
        new_ends_at = [overlapping.maximum(:ends_at), end_t].max
        base.update!(starts_at: new_starts_at, ends_at: new_ends_at)

        ids_to_merge = overlapping.where.not(id: base.id).pluck(:id)
        if ids_to_merge.any?
          # We are only reassigning the pay_period_id foreign key for timesheets being merged into the base period.
          # No per-record validations or callbacks are needed here, and running them would make this merge significantly slower.
          Timesheet.where(pay_period_id: ids_to_merge).update_all(pay_period_id: base.id) # rubocop:disable Rails/SkipsModelValidations
          where(id: ids_to_merge).delete_all
        end
      end
      return base
    end

    transaction do
      created = create!(starts_at: start_t, ends_at: end_t)

      previous = where(ends_at: ...created.starts_at).order(ends_at: :desc).first
      if previous && previous.ends_at < created.starts_at - 1.second
        previous.update!(ends_at: created.starts_at - 1.second)
      end

      following = where("starts_at > ?", created.ends_at).order(:starts_at).first
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

  def associate_orphan_shifts
    shifts_in_range = self.class.shifts_overlapping_period(self).where(timesheet_id: nil)
    return if shifts_in_range.empty?

    shifts_in_range.distinct.pluck(:employee_id).each do |employee_id|
      timesheet = timesheets.find_or_create_by!(employee_id: employee_id)
      # We are bulk attaching existing shifts to their employee's timesheet by setting timesheet_id only.
      # Skipping validations and callbacks keeps this operation efficient and avoids re-running business logic on historical shifts.
      shifts_in_range
        .where(employee_id: employee_id)
        .update_all(timesheet_id: timesheet.id) # rubocop:disable Rails/SkipsModelValidations
    end
  end

  private

  def prevent_destroy_with_approved_timesheets
    return unless timesheets.where.not(approved_at: nil).exists?

    errors.add(:base, "cannot delete pay period with approved timesheets")
    throw :abort
  end

  def backfill_timesheets_from_shifts
    shifts_in_range = self.class.shifts_overlapping_period(self)

    employee_ids = shifts_in_range.distinct.pluck(:employee_id)

    employee_ids.each do |employee_id|
      timesheet = timesheets.find_or_create_by!(employee_id: employee_id)
      # When backfilling, we need to associate large numbers of existing shifts to a timesheet by setting timesheet_id.
      # Validations and callbacks are not required for this mechanical foreign key update and would add unnecessary overhead.
      shifts_in_range
        .where(employee_id: employee_id)
        .update_all(timesheet_id: timesheet.id) # rubocop:disable Rails/SkipsModelValidations
    end
  end
end
