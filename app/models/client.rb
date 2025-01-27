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
  include Identificationable
  include Participantable
  include CalendarCustomizable
  include Personable

  include PgSearchable
  pg_search_config(
    against: [:active_at, :inactive_at, :number],
    associated_against: {
      person: [:first_name, :middle_name, :last_name]
    },
  )

  extend FriendlyId
  friendly_id :slug_candidates

  resourcify

  has_many :doctors_clients, dependent: :nullify
  has_many :doctors, through: :doctors_clients
  has_many :prescriptions, dependent: :destroy

  has_one :households_client, dependent: :destroy
  has_one :household, through: :households_client, dependent: :nullify

  scope :includes_associated, -> { includes([:person, :calendar_customization]) }

  after_create -> { self.update(:active_at, Time.current) }

  private

  def slug_candidates
    [
      person&.name,
      [person&.name, :number]
    ]
  end
end
