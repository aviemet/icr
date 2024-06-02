# == Schema Information
#
# Table name: job_titles
#
#  id          :bigint           not null, primary key
#  description :text
#  title       :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
class JobTitle < ApplicationRecord

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
  }, class_name: 'EmployeesJobTitle', dependent: nil, inverse_of: :active_employees_job_title

  has_many :active_employees, through: :active_employees_job_titles, source: :employee

  scope :includes_associated, -> { includes([:employees]) }
end
