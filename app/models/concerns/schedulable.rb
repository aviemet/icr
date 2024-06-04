module Schedulable
  extend ActiveSupport::Concern

  included do
    has_one :calendar_event, as: :schedulable, dependent: :nullify

    accepts_nested_attributes_for :calendar_event

    validates :calendar_event, presence: true

    scope :before, ->(time) { where("shift.calendar_event.starts_at > ?", time) }
    scope :after, ->(time) { calendar_event.after(time) }
    scope :between, ->(start_time, end_time) { before(start_time).after(end_time) }
  end
end
