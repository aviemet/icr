# frozen_string_literal: true

# == Schema Information
#
# Table name: trainings
#
#  id                :uuid             not null, primary key
#  active_on         :datetime
#  description       :text
#  estimated_minutes :integer
#  inactive_on       :datetime
#  name              :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
class Training < ApplicationRecord
  include PgSearchable
  pg_search_config(against: [:name, :description, :estimated_minutes, :active_on, :inactive_on])

  tracked
  resourcify

  has_many :employee_trainings, dependent: :destroy, inverse_of: :training
  has_many :employees, through: :employee_trainings

  has_many :requirement_items, class_name: "Requirement::Item", as: :fulfillable, dependent: :destroy
  has_many :requirements, through: :requirement_items, class_name: "Requirement::Requirement"

  validates :name, presence: true

  scope :includes_associated, -> { includes([]) }
end
