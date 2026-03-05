# == Schema Information
#
# Table name: shifts
#
#  id                :uuid             not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_event_id :uuid             not null
#  employee_id       :uuid             not null
#
# Indexes
#
#  index_shifts_on_calendar_event_id  (calendar_event_id)
#  index_shifts_on_employee_id        (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#  fk_rails_...  (employee_id => employees.id)
#
class Shift < ApplicationRecord
  include PgSearchable

  pg_search_config(against: [:employee_id])

  tracked
  resourcify

  belongs_to :employee
  belongs_to :calendar_event, class_name: "Calendar::Event"

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

  scope :includes_associated, -> { includes([]) }
end
