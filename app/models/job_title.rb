# == Schema Information
#
# Table name: job_titles
#
#  id          :uuid             not null, primary key
#  description :text
#  name        :string           not null
#  slug        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_job_titles_on_slug  (slug) UNIQUE
#
class JobTitle < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: [:slugged, :history]

  include PgSearchable
  pg_search_config(against: [:name, :description])

  rolify
  resourcify

  has_many :employees_job_titles, dependent: :nullify
  has_many :employees, through: :employees_job_titles, dependent: :nullify

  has_many :active_employees_job_titles, -> {
    where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)", Date.current, Date.current)
  }, class_name: "EmployeesJobTitle", dependent: nil, inverse_of: :job_title

  has_many :active_employees, through: :active_employees_job_titles, source: :employee

  validates :name, presence: true

  scope :includes_associated, -> { includes([:employees]) }
end
