# == Schema Information
#
# Table name: doctors
#
#  id         :uuid             not null, primary key
#  first_name :string
#  last_name  :string
#  notes      :text
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_doctors_on_slug  (slug) UNIQUE
#
class Doctor < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: [:slugged, :history]

  pg_search_scope(
    :search,
    against: [:first_name, :last_name, :notes],
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  has_many :doctors_clients, dependent: :nullify
  has_many :clients, through: :doctors_clients
  has_many :prescriptions, dependent: :nullify

  scope :includes_associated, -> { includes([]) }

  def name
    "#{first_name} #{last_name}"
  end
end
