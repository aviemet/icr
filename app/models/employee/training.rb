# frozen_string_literal: true

# == Schema Information
#
# Table name: trainings
#
#  id                :uuid             not null, primary key
#  description       :text
#  estimated_minutes :integer
#  name              :string
#  status            :integer          default("active"), not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
class Employee::Training < ApplicationRecord
  self.table_name = "trainings"

  include PgSearchable
  pg_search_config(against: [:name, :description, :estimated_minutes, :status])

  resourcify

  enum :status, {
    active: 0,
    inactive: 1,
  }, default: :active

  has_many :employees_trainings, class_name: "Employee::EmployeesTraining", dependent: :destroy, inverse_of: :training
  has_many :employees, through: :employees_trainings

  has_many :clients_trainings, class_name: "ClientsTraining", dependent: :destroy, inverse_of: :training
  has_many :clients, through: :clients_trainings

  has_many :requirement_items, class_name: "Requirement::Item", as: :fulfillable, dependent: :destroy
  has_many :requirements, through: :requirement_items, class_name: "Requirement::Requirement"

  validates :name, presence: true
  validates :estimated_minutes, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_blank: true
  validates :status, presence: true

  scope :includes_associated, -> {
    includes(employees_trainings: { employee: :person }, clients_trainings: { client: :person })
  }
end
