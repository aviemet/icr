# == Schema Information
#
# Table name: departments
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
#  index_departments_on_slug  (slug) UNIQUE
#
class Employee::Department < ApplicationRecord
  self.table_name = "departments"

  extend FriendlyId
  friendly_id :name, use: [:slugged, :history]

  include PgSearchable
  pg_search_config(against: [:name, :description])

  has_many :job_titles,
    class_name: "Employee::JobTitle",
    dependent: :nullify,
    inverse_of: :department

  validates :name, presence: true

  scope :includes_associated, -> { includes(:job_titles) }
end
