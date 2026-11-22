# == Schema Information
#
# Table name: shifts
#
#  id                      :uuid             not null, primary key
#  facilitator_approved_at :date
#  ihss                    :boolean          default(FALSE), not null
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  calendar_event_id       :uuid             not null
#  category_id             :uuid             not null
#  employee_id             :uuid
#  timesheet_id            :uuid
#
# Indexes
#
#  index_shifts_on_calendar_event_id  (calendar_event_id) UNIQUE
#  index_shifts_on_category_id        (category_id)
#  index_shifts_on_employee_id        (employee_id)
#  index_shifts_on_timesheet_id       (timesheet_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (timesheet_id => timesheets.id)
#
class Shift < ApplicationRecord
  include PgSearchable
  include Categorizable

  pg_search_config(against: [:employee_id])

  resourcify

  belongs_to :employee, optional: true
  belongs_to :calendar_event, class_name: "Calendar::Event"
  belongs_to :timesheet, optional: true

  validates :calendar_event_id, uniqueness: true
  validate :no_overlapping_shifts_for_employee

  before_validation :normalize_blank_employee_id

  after_create :attach_to_containing_pay_period

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

  def open?
    employee_id.blank?
  end

  scope :open, -> { where(employee_id: nil) }
  scope :assigned, -> { where.not(employee_id: nil) }
  scope :future, -> {
    joins(:calendar_event).where(calendar_events: { starts_at: Time.current.. })
  }
  scope :includes_associated, -> { includes(:calendar_event, :timesheet) }
  scope :facilitator_approved, -> { where.not(facilitator_approved_at: nil) }
  scope :facilitator_pending, -> { where(facilitator_approved_at: nil) }

  def facilitator_approved?
    facilitator_approved_at.present?
  end

  def occurrences_in(pay_period)
    return [] if calendar_event.blank?

    calendar_event.occurrences_in(pay_period.starts_at, pay_period.ends_at).map do |occurrence|
      Payroll::ShiftOccurrence.new(self, occurrence)
    end
  end

  def clear_facilitator_approval!
    return if facilitator_approved_at.blank?

    update!(facilitator_approved_at: nil)
  end

  def invalidate_approvals!
    clear_facilitator_approval!
    return if timesheet.blank?
    return if timesheet.approved_at.blank?

    timesheet.update!(approved_at: nil)
  end

  private

  def normalize_blank_employee_id
    self.employee_id = nil if employee_id.blank?
  end

  def no_overlapping_shifts_for_employee
    return if employee_id.blank?
    return unless calendar_event.present? && start_time.present? && end_time.present?

    scope = Shift.joins(:calendar_event)
      .where(employee_id: employee_id)
      .where("calendar_events.starts_at < ? AND calendar_events.ends_at > ?", end_time, start_time)
    scope = scope.where.not(id: id) if id.present?

    return unless scope.exists?

    errors.add(:base, "overlaps another shift for the same employee")
  end

  def attach_to_containing_pay_period
    PayPeriod.attach_shift!(self)
  end
end
