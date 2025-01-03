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
  include CalendarCustomizable
  include Personable

  pg_search_scope(
    :search,
    against: [:active_at, :inactive_at, :number],
    associated_against: {
      person: [:first_name, :last_name],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  has_many :employees_job_titles, dependent: :destroy
  has_many :job_titles, through: :employees_job_titles
  has_many :pay_rates, dependent: :destroy

  has_one :active_employees_job_title, -> {
    where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)", Time.current, Time.current)
  }, class_name: "EmployeesJobTitle", dependent: nil, inverse_of: :employee
  has_one :job_title, through: :active_employees_job_title, source: :job_title

  scope :includes_associated, -> { includes([:person, :identifications, :job_title, :pay_rates, :calendar_customization]) }

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
