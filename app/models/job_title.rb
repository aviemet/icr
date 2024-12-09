# == Schema Information
#
# Table name: job_titles
#
#  id          :uuid             not null, primary key
#  description :text
#  slug        :string           not null
#  title       :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_job_titles_on_slug  (slug) UNIQUE
#
class JobTitle < ApplicationRecord
  extend FriendlyId
  friendly_id :title, use: [:slugged, :history]

  pg_search_scope(
    :search,
    against: [:title, :description],
    using: {
      tsearch: { prefix: true },
      trigram: {},
    },
  )

  resourcify

  has_many :employees_job_titles, dependent: :nullify
  has_many :employees, through: :employees_job_titles, dependent: :nullify

  has_many :active_employees_job_titles, -> {
    where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)", Time.current, Time.current)
  }, class_name: 'EmployeesJobTitle', dependent: nil, inverse_of: :job_title

  has_many :active_employees, through: :active_employees_job_titles, source: :employee

  validates :title, presence: true

  scope :includes_associated, -> { includes([:employees]) }
end
