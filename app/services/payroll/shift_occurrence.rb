# frozen_string_literal: true

module Payroll
  class ShiftOccurrence < SimpleDelegator
    def self.interval_id(shift_id, occurrence)
      return shift_id.to_s unless occurrence.recurring

      "#{shift_id}:#{occurrence.original_starts_at.utc.iso8601(3)}"
    end

    def initialize(shift, occurrence)
      super(shift)
      @occurrence = occurrence
    end

    def id
      self.class.interval_id(__getobj__.id, @occurrence)
    end

    def shift_id
      __getobj__.id
    end

    delegate :starts_at, to: :@occurrence

    delegate :ends_at, to: :@occurrence

    def start_time
      starts_at
    end

    def end_time
      ends_at
    end

    def occurrence_starts_at
      @occurrence.original_starts_at
    end

    def recurring_occurrence?
      @occurrence.recurring
    end

    def render(view = nil, options: {})
      __getobj__.serializer(view).render(self, options)
    end

    def serializer(view = nil)
      __getobj__.serializer(view)
    end
  end
end
