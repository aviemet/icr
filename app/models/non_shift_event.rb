# == Schema Information
#
# Table name: non_shift_events
#
#  id                :uuid             not null, primary key
#  name              :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_entry_id :uuid             not null
#
# Indexes
#
#  index_non_shift_events_on_calendar_entry_id  (calendar_entry_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_entry_id => calendar_entries.id)
#
class NonShiftEvent < ApplicationRecord
  include Eventable

  pg_search_scope(
    :search,
    against: [:name],
    associated_against: {
      calendar_entry: [:stars_at, :ends_at],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  validates :name, presence: true

  has_many :event_participants, as: :event, dependent: :nullify
  has_many :clients, through: :event_participants, source: :participant, source_type: 'Client'
  has_many :employees, through: :event_participants, source: :participant, source_type: 'Employee'

  scope :includes_associated, -> { includes([:calendar_entry]) }
end
