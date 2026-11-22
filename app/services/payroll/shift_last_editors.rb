# frozen_string_literal: true

module Payroll
  class ShiftLastEditors
    def self.call(shifts)
      new(shifts).call
    end

    def initialize(shifts)
      @shifts = shifts.to_a
    end

    def call
      return {} if shifts.empty?

      event_ids = shifts.map { |shift| shift.calendar_event_id.to_s }.uniq
      versions_by_event = latest_time_update_versions(event_ids)
      users_by_id = users_for(versions_by_event.values)

      versions_by_event.each_with_object({}) do |(event_id, version), result|
        user = users_by_id[version.whodunnit.to_s]
        next if user.blank?

        result[event_id] = {
          id: user.id.to_s,
          name: display_name(user),
          initials: initials_for(user),
          edited_at: version.created_at.iso8601,
        }
      end
    end

    private

    attr_reader :shifts

    def latest_time_update_versions(event_ids)
      versions = PaperTrail::Version
        .where(item_type: "Calendar::Event", event: "update", item_id: event_ids)
        .order(created_at: :desc)
        .to_a

      versions.each_with_object({}) do |version, result|
        next if result.key?(version.item_id)
        next unless time_change?(version)

        result[version.item_id] = version
      end
    end

    def time_change?(version)
      changes = version.changeset
      return true if changes.blank?

      changes.key?("starts_at") || changes.key?("ends_at")
    end

    def users_for(versions)
      user_ids = versions.filter_map(&:whodunnit).uniq
      return {} if user_ids.empty?

      User.includes(:person).where(id: user_ids).index_by { |user| user.id.to_s }
    end

    def display_name(user)
      person_name = user.person&.name&.strip
      return person_name if person_name.present?

      user.email
    end

    def initials_for(user)
      person = user.person
      if person&.first_name.present?
        first = person.first_name[0]
        last = person.last_name.presence&.[](0)
        return "#{first}#{last}".upcase
      end

      user.email[0].upcase
    end
  end
end
