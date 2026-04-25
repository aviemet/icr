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

  has_many :timesheets, dependent: :nullify

  after_create :backfill_timesheets_from_shifts

  scope :includes_associated, -> { includes(:timesheets) }

  def self.shifts_overlapping_period(pay_period)
    Shift.joins(:calendar_event).where(
      "calendar_events.starts_at <= ? AND calendar_events.ends_at >= ?",
      pay_period.ends_at,
      pay_period.starts_at,
    )
  end

  private

  def backfill_timesheets_from_shifts
    shifts_in_range = self.class.shifts_overlapping_period(self)

    employee_ids = shifts_in_range.distinct.pluck(:employee_id)

    employee_ids.each do |employee_id|
      timesheet = timesheets.find_or_create_by!(employee_id: employee_id)
      shifts_in_range
        .where(employee_id: employee_id)
        .update_all(timesheet_id: timesheet.id) # rubocop:disable Rails/SkipsModelValidations
    end
  end
end
