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
#  category_id :uuid             not null
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
  include Contactable
  include Categorizable

  extend FriendlyId
  friendly_id :name, use: [:slugged, :history]

  include PgSearchable
  pg_search_config(against: [:name, :notes])

  resourcify

  validates :name, presence: true

  scope :includes_associated, -> { includes([:category]) }
end
