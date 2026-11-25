# == Schema Information
#
# Table name: clients
#
#  id                    :uuid             not null, primary key
#  active_at             :date
#  color                 :string
#  communication_notes   :text
#  ihss_authorized_hours :decimal(8, 2)
#  ihss_notes            :text
#  ihss_share_of_cost    :decimal(10, 2)
#  inactive_at           :date
#  ipp_ends_on           :date
#  ipp_review_on         :date
#  ipp_starts_on         :date
#  medi_cal_number       :string
#  number                :string
#  preferred_hospital    :string
#  preferred_language    :string
#  referred_by_other     :string
#  slug                  :string           not null
#  uci_number            :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  person_id             :uuid             not null
#  regional_center_id    :uuid
#
# Indexes
#
#  index_clients_on_person_id           (person_id)
#  index_clients_on_regional_center_id  (regional_center_id)
#  index_clients_on_slug                (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#  fk_rails_...  (regional_center_id => regional_centers.id)
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
    against: [:active_at, :inactive_at, :number, :uci_number],
    associated_against: {
      person: [:first_name, :middle_name, :last_name]
    },
  )

  extend FriendlyId

  friendly_id :slug_candidates

  resourcify

  belongs_to :regional_center, optional: true

  validate :referral_source_mutual_exclusion

  has_many :doctors_clients, dependent: :nullify
  has_many :doctors, through: :doctors_clients
  has_many :prescriptions, dependent: :destroy

  has_one :households_client, dependent: :destroy
  has_one :household, through: :households_client, dependent: :nullify

  has_many :clients_managers,
    class_name: "ClientsManager",
    dependent: :destroy,
    inverse_of: :client
  has_many :managers,
    class_name: "Employee",
    through: :clients_managers,
    source: :manager

  has_one :active_client_manager, -> {
    merge(ClientsManager.current)
  }, class_name: "ClientsManager", dependent: nil, inverse_of: :client
  has_one :current_manager, through: :active_client_manager, source: :manager

  has_many :clients_attendants,
    class_name: "ClientsAttendant",
    dependent: :destroy,
    inverse_of: :client
  has_many :attendants,
    class_name: "Employee",
    through: :clients_attendants,
    source: :attendant

  has_many :current_clients_attendants,
    -> { merge(ClientsAttendant.current) },
    class_name: "ClientsAttendant",
    dependent: nil,
    inverse_of: :client
  has_many :current_attendants,
    class_name: "Employee",
    through: :current_clients_attendants,
    source: :attendant

  has_many :support_contacts,
    class_name: "Client::SupportContact",
    dependent: :destroy,
    inverse_of: :client
  has_many :allergies,
    class_name: "Client::Allergy",
    dependent: :destroy,
    inverse_of: :client
  has_many :links,
    class_name: "Client::Link",
    dependent: :destroy,
    inverse_of: :client
  has_many :diagnoses,
    class_name: "Client::Diagnosis",
    dependent: :destroy,
    inverse_of: :client
  has_many :hospital_visits,
    class_name: "Client::HospitalVisit",
    dependent: :destroy,
    inverse_of: :client
  has_one :life_detail,
    class_name: "Client::LifeDetail",
    dependent: :destroy,
    inverse_of: :client
  has_many :enrollments,
    class_name: "Client::Enrollment",
    dependent: :destroy,
    inverse_of: :client
  has_many :incident_reports, dependent: :nullify
  has_many :compliance_form_submissions,
    class_name: "Compliance::FormSubmission",
    dependent: :nullify,
    inverse_of: :client

  has_many :clients_trainings,
    class_name: "ClientsTraining",
    dependent: :destroy,
    inverse_of: :client
  has_many :trainings,
    class_name: "Employee::Training",
    through: :clients_trainings

  accepts_nested_attributes_for :life_detail
  accepts_nested_attributes_for :support_contacts, allow_destroy: true
  accepts_nested_attributes_for :allergies, allow_destroy: true
  accepts_nested_attributes_for :diagnoses, allow_destroy: true

  scope :includes_associated, -> {
    includes(
      :calendar_customization,
      :household,
      :life_detail,
      :current_manager,
      :current_attendants,
      :regional_center,
      person: { contact: { addresses: :category, emails: :category, phones: :category } },
    )
  }

  scope :includes_show, -> {
    includes_associated.includes(
      :doctors,
      :doctors_clients,
      :clients_managers,
      :clients_attendants,
      :managers,
      :attendants,
      support_contacts: { person: { contact: [:phones, :emails, :addresses] } },
      allergies: [],
      links: [],
      diagnoses: :doctor,
      hospital_visits: [:doctor, :incident_report],
      enrollments: :vendor,
      prescriptions: [:medication, :dosage, :doctor],
      incident_reports: [:category, :reported_by, :reported_to, :doctor],
      clients_trainings: :training,
      compliance_form_submissions: [:form_template, :conducted_by, :corrective_actions],
    )
  }

  def schedule_events_between(start_time, end_time)
    ids = calendar_events.for_schedule_range(start_time, end_time).reselect("calendar_events.id")
    Calendar::Event.where(id: ids).with_schedule_association_preloads
  end

  after_create -> { self.update(active_at: Time.current) }

  def active?
    active_at.present? && (inactive_at.nil? || inactive_at > Time.current)
  end

  def referral_label
    regional_center&.name.presence || referred_by_other.presence
  end

  private

  def referral_source_mutual_exclusion
    return if regional_center_id.blank? || referred_by_other.blank?

    errors.add(:base, "Choose a regional center or other referral, not both")
  end

  def slug_candidates
    [
      person&.name,
      [person&.name, :number]
    ]
  end
end
