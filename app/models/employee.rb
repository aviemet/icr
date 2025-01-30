# == Schema Information
#
# Table name: employees
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
#  index_employees_on_person_id  (person_id)
#  index_employees_on_slug       (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
class Employee < ApplicationRecord
  include Identificationable
  include Participantable
  include CalendarCustomizable
  include Personable
  include Attachment::HasImages
  include Attachment::HasDocuments

  extend FriendlyId
  friendly_id :slug_candidates, use: [:slugged, :history]

  include PgSearchable
  pg_search_config(
    against: [:active_at, :inactive_at, :number],
    associated_against: {
      person: [:first_name, :last_name],
    },
  )

  resourcify

  ##############
  # Job Titles #
  ##############
  has_many :employees_job_titles, dependent: :destroy
  has_many :job_titles, through: :employees_job_titles
  has_one :active_employees_job_title, -> {
    where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)", 1.second.from_now, 1.second.from_now)
  }, class_name: "EmployeesJobTitle", dependent: :destroy, inverse_of: :employee
  has_one :job_title, through: :active_employees_job_title, source: :job_title

  def job_title=(new_job_title)
    assign_job_title(new_job_title)
  end

  def assign_job_title(new_job_title, starts_at: Time.current)
    if new_job_title.is_a?(String) || new_job_title.is_a?(Symbol)
      search_term = new_job_title.to_s
      new_job_title = JobTitle.find_by(name: search_term.titleize) ||
        JobTitle.find_by(slug: search_term.parameterize)
    end

    # Don't create a new assignment if it's the same job title
    return if job_title == new_job_title

    transaction do
      # End the current job title at the start of the new one
      active_employees_job_title&.update!(ends_at: starts_at)

      employees_job_titles.create!(
        job_title: new_job_title,
        starts_at: starts_at,
      )
    end

    reload
  end

  ##########
  # Shifts #
  ##########
  has_many :shifts, dependent: :nullify
  has_many :shift_events, through: :shifts, class_name: "Calendar::Event", source: :calendar_event

  #############
  # Pay Rates #
  #############
  has_many :pay_rates, dependent: :destroy

  ############
  # Managers #
  ############
  # Join table for employees managed by employee
  has_many :managed_employees_managers,
    class_name: "EmployeesManager",
    foreign_key: :manager_id,
    dependent: :destroy,
    inverse_of: :manager
  has_many :managed_employees, through: :managed_employees_managers, source: :employee

  has_many :managers_employees_managers,
    class_name: "EmployeesManager",
    dependent: nil,
    inverse_of: :employee
  has_many :managers, through: :managers_employees_managers, source: :manager

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

  scope :includes_associated, -> { includes([:person, :job_title, :calendar_customization]) }

  def all_events
    shift_sql = shift_events.select(:id).to_sql
    participant_sql = calendar_events.select(:id).to_sql

    Calendar::Event.where("calendar_events.id IN (#{shift_sql} UNION #{participant_sql})")
  end

  def active?
    active_at.present? && (inactive_at.nil? || inactive_at > Time.current)
  end

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
