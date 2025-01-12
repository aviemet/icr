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
  include Contactable

  extend FriendlyId
  friendly_id :name

  include PgSearchable
  pg_search_config(against: [:name])

  tracked
  resourcify

  validates :name, presence: true

  scope :includes_associated, -> { includes([]) }
end
