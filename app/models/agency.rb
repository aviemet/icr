# == Schema Information
#
# Table name: agencies
#
#  id         :uuid             not null, primary key
#  name       :string           not null
#  settings   :jsonb
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_agencies_on_slug  (slug) UNIQUE
#
class Agency < ApplicationRecord
  extend FriendlyId
  friendly_id :name

  include Contactable

  pg_search_scope(
    :search,
    against: [:name],
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  tracked
  resourcify

  validates :name, presence: true

  scope :includes_associated, -> { includes([]) }
end
