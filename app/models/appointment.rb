# == Schema Information
#
# Table name: appointments
#
#  id                :bigint           not null, primary key
#  name              :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_event_id :bigint           not null
#
# Indexes
#
#  index_appointments_on_calendar_event_id  (calendar_event_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#
class Appointment < ApplicationRecord
  include Eventable

  pg_search_scope(
    :search,
    against: [:calendar_event],
    associated_against: {
      calendar_event: [],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  belongs_to :calendar_event

  has_many :event_participants, as: :event, dependent: :nullify
  has_many :clients, through: :event_participants, source: :participant, source_type: 'Client'
  has_many :employees, through: :event_participants, source: :participant, source_type: 'Employee'

  scope :includes_associated, -> { includes([:calendar_event]) }
end
