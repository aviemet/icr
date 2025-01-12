# == Schema Information
#
# Table name: calendar_event_exceptions
#
#  id                :uuid             not null, primary key
#  cancelled         :datetime
#  ends_at           :datetime
#  rescheduled       :datetime
#  starts_at         :datetime
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_event_id :uuid             not null
#
# Indexes
#
#  index_calendar_event_exceptions_on_calendar_event_id  (calendar_event_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#
class Calendar::EventException < ApplicationRecord
  resourcify

  belongs_to :calendar_event, class_name: "Calendar::Event"

  validate :cancelled_or_rescheduled

  scope :includes_associated, -> { includes([:calendar_event]) }

  private

  def cancelled_or_rescheduled
    if [cancelled, rescheduled].all?(&:blank?) || [cancelled, rescheduled].all?(&:present?)
      errors.add(:base, "Event must be either cancelled or rescheduled")
    end
  end
end
