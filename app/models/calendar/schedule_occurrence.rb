# frozen_string_literal: true

class Calendar::ScheduleOccurrence < SimpleDelegator
  def initialize(event, occurrence)
    super(event)
    @occurrence = occurrence
  end

  def id
    return event.id unless @occurrence.recurring

    "#{event.id}__#{@occurrence.original_starts_at.utc.iso8601(3)}"
  end

  delegate :starts_at, to: :@occurrence

  delegate :ends_at, to: :@occurrence

  def master_id
    event.id
  end

  def occurrence_starts_at
    @occurrence.original_starts_at
  end

  def is_recurring
    @occurrence.recurring
  end

  def event_exceptions
    []
  end

  private

  def event
    __getobj__
  end
end
