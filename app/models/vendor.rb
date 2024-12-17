# == Schema Information
#
# Table name: vendors
#
#  id          :uuid             not null, primary key
#  name        :string           not null
#  notes       :text
#  slug        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid
#
# Indexes
#
#  index_vendors_on_category_id  (category_id)
#  index_vendors_on_slug         (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#
class Vendor < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: [:slugged, :history]

  include Contactable
  include Categorizable

  pg_search_scope(
    :search,
    against: [:name, :notes],
    associated_against: {
      category: [],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  validates :name, presence: true

  scope :includes_associated, -> { includes([:category]) }
end
