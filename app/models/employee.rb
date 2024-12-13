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
  extend FriendlyId
  friendly_id :slug_candidates, use: [:slugged, :history]

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

  has_many :employees_job_titles, dependent: :nullify
  has_many :job_titles, through: :employees_job_titles

  has_one :active_employees_job_title, -> {
    where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)", Time.current, Time.current)
  }, class_name: 'EmployeesJobTitle', dependent: nil, inverse_of: :employee
  has_one :job_title, through: :active_employees_job_title, source: :job_title

  has_many :pay_rates, dependent: :destroy

  accepts_nested_attributes_for :person

  scope :includes_associated, -> { includes([:person, :identifications, :job_titles, :pay_rates]) }

  private

  def slug_candidates
    [
      person.name,
      [person.name, :number]
    ]
  end
end
