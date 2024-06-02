class DoctorsClient < ApplicationRecord

  pg_search_scope(
    :search,
    against: [:doctor, :client, :notes],
    associated_against: {
      doctor: [],
      client: [],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  belongs_to :doctor
  belongs_to :client

  scope :includes_associated, -> { includes([:doctor, :client]) }
end
