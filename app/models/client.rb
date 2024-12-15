# == Schema Information
#
# Table name: clients
#
#  id          :uuid             not null, primary key
#  active_at   :date
#  color       :string
#  inactive_at :date
#  number      :string
#  slug        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  person_id   :uuid             not null
#
# Indexes
#
#  index_clients_on_person_id  (person_id)
#  index_clients_on_slug       (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
class Client < ApplicationRecord
  extend FriendlyId
  friendly_id :slug_candidates

  include Identificationable
  include Shiftable

  pg_search_scope(
    :search,
    against: [:active_at, :inactive_at, :number],
    associated_against: {
      person: [:first_name, :middle_name, :last_name],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
    ignoring: :accents,
  )

  resourcify

  belongs_to :person

  has_many :doctors_clients, dependent: :nullify
  has_many :doctors, through: :doctors_clients
  has_many :prescriptions, dependent: :destroy

  has_one :households_client, dependent: :nullify
  has_one :household, through: :households_client, dependent: :nullify

  accepts_nested_attributes_for :person

  scope :includes_associated, -> { includes([:person, :identifications]) }

  private

  def slug_candidates
    [
      person&.name,
      [person&.name, :number]
    ]
  end
end
