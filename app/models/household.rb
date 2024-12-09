# == Schema Information
#
# Table name: households
#
#  id         :uuid             not null, primary key
#  name       :string
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_households_on_slug  (slug) UNIQUE
#
class Household < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: [:slugged, :history]

  include Contactable
  include Participantable

  pg_search_scope(
    :search,
    against: [:name],
    associated_against: {
      employee: [],
      client: [],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  has_many :households_clients, dependent: :nullify
  has_many :clients, through: :households_clients, dependent: :nullify

  has_many :shifts, through: :event_participants, source: :event, source_type: 'Shift'
end
