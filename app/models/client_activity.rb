class ClientActivity < ApplicationRecord
  include PgSearch::Model

  pg_search_scope(
    :search,
    against: [:title, :notes],
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify


  scope :includes_associated, -> { includes([]) }
end
