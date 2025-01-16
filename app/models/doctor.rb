# == Schema Information
#
# Table name: doctors
#
#  id         :uuid             not null, primary key
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  person_id  :uuid             not null
#
# Indexes
#
#  index_doctors_on_person_id  (person_id)
#  index_doctors_on_slug       (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
class Doctor < ApplicationRecord
  include Participantable
  include Personable

  extend FriendlyId
  friendly_id :name, use: [:slugged, :history]

  include PgSearchable
  pg_search_config(against: [:first_name, :last_name, :notes])

  resourcify

  has_many :doctors_clients, dependent: :nullify
  has_many :clients, through: :doctors_clients
  has_many :prescriptions, dependent: :nullify

  scope :includes_associated, -> { includes([:clients, :prescriptions]) }

  def name
    "#{person&.first_name} #{person&.last_name}"
  end
end
