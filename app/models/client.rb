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
  include Attachment::HasImages
  include Attachment::HasDocuments

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

  has_many :clients_managers,
    class_name: "ClientsManager",
    dependent: :destroy
  has_many :managers,
    class_name: "Employee",
    through: :clients_managers,
    source: :manager

  has_one :active_client_manager, -> {
    where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)", Date.current, Date.current)
  }, class_name: "ClientManager", dependent: nil, inverse_of: :client
  has_one :current_manager, through: :active_client_manager, source: :manager

  has_many :clients_attendants,
    class_name: "ClientsAttendant",
    dependent: :destroy
  has_many :attendants,
    class_name: "Employee",
    through: :clients_attendants,
    source: :attendant

  scope :includes_associated, -> { includes([:person, :calendar_customization]) }

  after_create -> { self.update(active_at: Time.current) }

  def active?
    active_at.present? && (inactive_at.nil? || inactive_at > Time.current)
  end

  private

  def slug_candidates
    [
      person&.name,
      [person&.name, :number]
    ]
  end
end
