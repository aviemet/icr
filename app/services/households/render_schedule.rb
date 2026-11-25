module Households
  class RenderSchedule
    def self.call(household:, range_start:, range_end:)
      new(household:, range_start:, range_end:).call
    end

    def initialize(household:, range_start:, range_end:)
      @household = household
      @range_start = range_start
      @range_end = range_end
    end

    def call
      memberships = household.membership_windows_overlapping(range_start, range_end)
      windows_by_client_id = memberships.group_by(&:client_id)

      masters = household.schedule_events_between(range_start, range_end)
      rows = Calendar::Event.schedule_occurrences_in(
        masters,
        range_start: range_start,
        range_end: range_end,
      )

      filtered = rows.select { |row| occurrence_covered?(row, windows_by_client_id) }
      Calendar::Events::HouseholdSerializer.render(filtered)
    end

    private

    attr_reader :household, :range_start, :range_end

    def occurrence_covered?(row, windows_by_client_id)
      day = row.starts_at.to_date
      Array(row.clients).any? do |client|
        Array(windows_by_client_id[client.id]).any? { |membership| membership.covers?(day) }
      end
    end
  end
end
