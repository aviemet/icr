# == Schema Information
#
# Table name: employees
#
#  id          :bigint           not null, primary key
#  active_at   :date
#  color       :string
#  inactive_at :date
#  number      :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  person_id   :bigint           not null
#
# Indexes
#
#  index_employees_on_person_id  (person_id)
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
class Employee < ApplicationRecord
  include Identificationable
  include Participantable

  pg_search_scope(
    :search,
    against: [:active_at, :inactive_at, :number],
    associated_against: {
      person: [],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  belongs_to :person

  has_many :shifts, dependent: :nullify
  has_many :appointments, through: :event_participants, source: :event, source_type: 'Appointment'

  has_many :employees_job_titles, dependent: :nullify
  has_many :job_titles, through: :employees_job_titles

  has_one :active_employees_job_title, -> {
    where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)", Time.current, Time.current)
  }, class_name: 'EmployeesJobTitle', dependent: nil, inverse_of: :employee
  has_one :job_title, through: :active_employees_job_title, source: :job_title

  has_many :pay_rates, dependent: :destroy

  accepts_nested_attributes_for :person

  scope :includes_associated, -> { includes([:person, :identifications, :job_titles, :pay_rates]) }
end
