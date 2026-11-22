# == Schema Information
#
# Table name: doctors
#
#  id            :uuid             not null, primary key
#  notes         :text
#  npi           :string
#  practice_name :string
#  slug          :string           not null
#  specialty     :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  person_id     :uuid             not null
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

  pg_search_config(
    against: [],
    associated_against: {
      person: [:first_name, :last_name]
    },
  )

  resourcify

  has_many :doctors_clients, dependent: :nullify
  has_many :clients, through: :doctors_clients
  has_many :prescriptions, dependent: :nullify
  has_many :diagnoses, class_name: "Client::Diagnosis", dependent: :nullify, inverse_of: :doctor
  has_many :hospital_visits, class_name: "Client::HospitalVisit", dependent: :nullify, inverse_of: :doctor
  has_many :incident_reports, dependent: :nullify, inverse_of: :doctor

  scope :includes_associated, -> { includes([:clients, :prescriptions]) }

  scope :includes_show, -> {
    includes(
      :clients,
      :incident_reports,
      diagnoses: :client,
      hospital_visits: :client,
      prescriptions: [:medication, :dosage, :client],
      person: { contact: [:phones, :emails, :addresses] },
      doctors_clients: :client,
    )
  }

  def name
    "#{person&.first_name} #{person&.last_name}"
  end
end
