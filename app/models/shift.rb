# == Schema Information
#
# Table name: shifts
#
#  id                :uuid             not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_event_id :uuid             not null
#  employee_id       :uuid             not null
#  timesheet_id      :uuid
#
# Indexes
#
#  index_shifts_on_calendar_event_id  (calendar_event_id) UNIQUE
#  index_shifts_on_employee_id        (employee_id)
#  index_shifts_on_timesheet_id       (timesheet_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (timesheet_id => timesheets.id)
#
class Shift < ApplicationRecord
  include PgSearchable

  pg_search_config(against: [:employee_id])

  tracked
  resourcify

  belongs_to :employee
  belongs_to :calendar_event, class_name: "Calendar::Event"
  belongs_to :timesheet, optional: true

  validates :calendar_event_id, uniqueness: true

  after_create :associate_with_timesheet_if_in_active_period

  accepts_nested_attributes_for :calendar_event

  delegate :starts_at, :ends_at, to: :calendar_event

  def start_time
    calendar_event&.starts_at
  end

  def end_time
    calendar_event&.ends_at
  end

  def duration_hours
    return 0 if start_time.blank? || end_time.blank?

    (end_time - start_time) / 1.hour.to_f
  end

  scope :includes_associated, -> { includes(:calendar_event, :timesheet) }

  private

  def associate_with_timesheet_if_in_active_period
    shift_date = start_time&.to_date
    return unless shift_date

    active_start, active_end = Payroll::Period.period_dates(Date.current)
    return if shift_date < active_start
    return if shift_date > active_end

    period_start_dt = active_start.to_time.beginning_of_day
    period_end_dt = active_end.to_time.end_of_day
    pay_period = PayPeriod.find_by(starts_at: period_start_dt, ends_at: period_end_dt)

    unless pay_period
      pay_period = PayPeriod.create!(starts_at: period_start_dt, ends_at: period_end_dt)
      return
    end

    timesheet = pay_period.timesheets.find_or_create_by!(employee_id: employee_id)
    update_column(:timesheet_id, timesheet.id) # rubocop:disable Rails/SkipsModelValidations
  end
end
