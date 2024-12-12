# == Schema Information
#
# Table name: calendar_entry_exceptions
#
#  id                :uuid             not null, primary key
#  cancelled         :datetime
#  ends_at           :datetime
#  rescheduled       :datetime
#  starts_at         :datetime
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_entry_id :uuid             not null
#
# Indexes
#
#  index_calendar_entry_exceptions_on_calendar_entry_id  (calendar_entry_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_entry_id => calendar_entries.id)
#
class Calendar::EntryException < ApplicationRecord
  pg_search_scope(
    :search,
    against: [:calendar_entry, :rescheduled, :cancelled, :starts_at, :ends_at],
    associated_against: {
      calendar_entry: [],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  belongs_to :calendar_entry

  scope :includes_associated, -> { includes([:calendar_entry]) }
end
