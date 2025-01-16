# == Schema Information
#
# Table name: households
#
#  id         :uuid             not null, primary key
#  name       :string           not null
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_households_on_slug  (slug) UNIQUE
#
class Household < ApplicationRecord
  include Contactable
  include Participantable

  extend FriendlyId
  friendly_id :name, use: [:slugged, :history]

  include PgSearchable
  pg_search_config(against: [:name])

  has_many :households_clients, dependent: :nullify
  has_many :clients, through: :households_clients, dependent: :nullify

  validates :name, presence: true
end
