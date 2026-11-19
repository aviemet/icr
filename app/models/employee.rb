# == Schema Information
#
# Table name: employees
#
#  id                   :uuid             not null, primary key
#  active_at            :date
#  color                :string
#  communication_notes  :text
#  eligible_for_hire    :boolean          default(TRUE), not null
#  inactive_at          :date
#  ineligibility_reason :text
#  number               :string
#  preferred_language   :string
#  slug                 :string           not null
#  status               :integer
#  termination_reason   :text
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  person_id            :uuid             not null
#
# Indexes
#
#  index_employees_on_person_id  (person_id)
#  index_employees_on_slug       (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
class Employee < ApplicationRecord
  self.table_name = "employees"

  include Identificationable
  include Participantable
  include CalendarCustomizable
  include Personable
  include Attachment::HasImages
  include Attachment::HasDocuments
  include Employee::StateMachine

  extend FriendlyId

  friendly_id :slug_candidates, use: [:slugged, :history]

  include PgSearchable

  pg_search_config(
    against: [:active_at, :inactive_at, :number, :status],
    associated_against: {
      person: [:first_name, :last_name],
    },
  )

  attribute :eligible_for_hire, :boolean, default: true

  enum :status, {
    applicant: 0,
    offered: 1,
    employed: 2,
    declined: 3,
    terminated: 4,
    application_withdrawn: 5
  }

  resourcify

  ##############
  # Job Titles #
  ##############
  has_many :employees_job_titles, class_name: "Employee::EmployeesJobTitle", dependent: :destroy
  has_many :job_titles, through: :employees_job_titles, class_name: "Employee::JobTitle"
  has_one :active_employees_job_title, -> {
    where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)", 1.second.from_now, 1.second.from_now)
  }, class_name: "Employee::EmployeesJobTitle", dependent: :destroy, inverse_of: :employee
  has_one :job_title, through: :active_employees_job_title, source: :job_title, class_name: "Employee::JobTitle"

  def job_title=(new_job_title)
    assign_job_title(new_job_title)
  end

  def assign_job_title(new_job_title, starts_at: Time.current)
    if new_job_title.is_a?(String) || new_job_title.is_a?(Symbol)
      search_term = new_job_title.to_s
      new_job_title = Employee::JobTitle.find_by(name: search_term.titleize) ||
        Employee::JobTitle.find_by(slug: search_term.parameterize)
    end

    return if job_title == new_job_title

    transaction do
      active_employees_job_title&.update(ends_at: starts_at, application_type: :position_change, offer_status: :accepted)

      employees_job_titles.create!(
        job_title: new_job_title,
        starts_at: starts_at,
        application_type: :new_hire,
        offer_status: :accepted,
      )
    end

    reload
  end

  ##########
  # Shifts #
  ##########
  has_many :shifts, dependent: :destroy
  has_many :shift_events, through: :shifts, class_name: "Calendar::Event", source: :calendar_event, dependent: :destroy

  def schedule_events_between(start_time, end_time)
    all_events
      .distinct
      .with_schedule_association_preloads
      .between(start_time, end_time)
  end

  #############
  # Pay Rates #
  #############
  has_many :pay_rates, class_name: "Employee::PayRate", dependent: :destroy, inverse_of: :employee

  ############
  # Managers #
  ############
  has_many :managed_employees_managers,
    class_name: "Employee::EmployeesManager",
    foreign_key: :manager_id,
    dependent: :destroy,
    inverse_of: :manager
  has_many :managed_employees, through: :managed_employees_managers, source: :employee

  has_many :managers_employees_managers,
    class_name: "Employee::EmployeesManager",
    dependent: nil,
    inverse_of: :employee
  has_many :managers, through: :managers_employees_managers, source: :manager

  has_one :primary_manager_assignment, -> {
    where(primary: true)
      .where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)", Time.current, Time.current)
  }, class_name: "Employee::EmployeesManager", dependent: nil, inverse_of: :employee
  has_one :primary_manager, through: :primary_manager_assignment, source: :manager

  ###################
  # Managed Clients #
  ###################
  has_many :clients_managers,
    class_name: "ClientsManager",
    foreign_key: :manager_id,
    dependent: :destroy,
    inverse_of: :manager

  has_many :all_managed_clients,
    through: :clients_managers,
    source: :client

  has_many :active_clients_managers, -> {
    where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)", Time.current, Time.current)
  },
    class_name: "ClientsManager",
    foreign_key: :manager_id,
    dependent: :destroy,
    inverse_of: :manager

  has_many :managed_clients,
    through: :active_clients_managers,
    source: :client

  ####################
  # Attended Clients #
  ####################
  has_many :clients_attendants,
    class_name: "ClientsAttendant",
    foreign_key: :attendant_id,
    dependent: :destroy,
    inverse_of: :attendant

  has_many :all_attended_clients,
    through: :clients_attendants,
    source: :client

  has_many :active_clients_attendants, -> {
    where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)", Time.current, Time.current)
  },
    class_name: "ClientsAttendant",
    foreign_key: :attendant_id,
    dependent: :destroy,
    inverse_of: :attendant

  has_many :attended_clients,
    through: :active_clients_attendants,
    source: :client

  ##############
  # Trainings  #
  ##############

  has_many :employees_trainings, class_name: "Employee::EmployeesTraining", dependent: :destroy, inverse_of: :employee
  has_many :trainings, through: :employees_trainings

  #################
  # HR records    #
  #################
  has_many :support_contacts, class_name: "Employee::SupportContact", dependent: :destroy, inverse_of: :employee
  has_many :credentials, class_name: "Employee::Credential", dependent: :destroy, inverse_of: :employee
  has_many :clearances, class_name: "Employee::Clearance", dependent: :destroy, inverse_of: :employee
  has_many :interviews, class_name: "Employee::Interview", dependent: :destroy, inverse_of: :employee

  ####################
  # Interview Notes  #
  ####################

  has_many :interview_notes, class_name: "Employee::InterviewNote", dependent: :destroy, inverse_of: :employee

  has_many :reported_incident_reports, class_name: "IncidentReport", foreign_key: :reported_by_id, dependent: :destroy, inverse_of: :reported_by
  has_many :received_incident_reports, class_name: "IncidentReport", foreign_key: :reported_to_id, dependent: :destroy, inverse_of: :reported_to

  accepts_nested_attributes_for :support_contacts, allow_destroy: true

  scope :applicants, -> { where(status: :applicant) }
  scope :actively_employed, -> { where(status: :employed) }
  scope :terminated, -> { where(status: :terminated) }
  scope :eligible_for_hire, -> { where(eligible_for_hire: true) }
  scope :not_eligible_for_hire, -> { where(eligible_for_hire: false) }

  scope :includes_associated, -> { includes([:person, :job_title, :calendar_customization]) }

  scope :includes_show, -> {
    includes_associated.includes(
      :pay_rates,
      :credentials,
      :clearances,
      :identifications,
      :managed_clients,
      :attended_clients,
      clients_managers: { client: { person: :contact } },
      clients_attendants: { client: { person: :contact } },
      managers_employees_managers: { manager: { person: :contact } },
      primary_manager: { person: :contact },
      employees_trainings: :training,
      support_contacts: { person: { contact: [:phones, :emails, :addresses] } },
      interviews: [],
      person: { contact: { addresses: :category, emails: :category, phones: :category } },
    )
  }

  def all_events
    shift_sql = shift_events.select(:id).to_sql
    participant_sql = calendar_events.select(:id).to_sql

    Calendar::Event.where("calendar_events.id IN (#{shift_sql} UNION #{participant_sql})")
  end

  def active?
    employed? && active_at.present? && (inactive_at.nil? || inactive_at > Time.current)
  end

  def eligible_for_hire?
    eligible_for_hire
  end

  validates :active_at, presence: true, if: -> { employed? }
  validates :inactive_at, presence: true, if: -> { terminated? }
  validates :termination_reason, presence: true, if: -> { terminated? }
  validates :ineligibility_reason, presence: true, if: -> { application_withdrawn? }

  private

  def slug_candidates
    if person&.name
      [
        person.name,
        [person.name, :number]
      ]
    else
      [number]
    end
  end

end
