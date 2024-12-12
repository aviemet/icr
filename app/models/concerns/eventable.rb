module Eventable
  extend ActiveSupport::Concern

  included do
    belongs_to :calendar_entry, class_name: 'Calendar::Entry'

    delegate :start_time, :end_time, to: :calendar_entry

    def self.between(start_date, end_date)
      joins(:calendar_entry).merge(Calendar::Entry.between(start_date, end_date))
    end
  end
end
