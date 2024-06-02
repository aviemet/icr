class HouseholdsClient < ApplicationRecord

  pg_search_scope(
    :search,
    against: [:household, :client, :starts_at, :ends_at],
    associated_against: {
      household: [],, client: [],    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  belongs_to :household
  belongs_to :client

  scope :includes_associated, -> { includes([:household, :client]) }
end
