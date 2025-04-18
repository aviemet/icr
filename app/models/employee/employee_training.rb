# frozen_string_literal: true

# == Schema Information
#
# Table name: employee_trainings
#
#  id           :uuid             not null, primary key
#  completed_at :datetime
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  employee_id  :uuid             not null
#  training_id  :uuid             not null
#
# Indexes
#
#  index_employee_trainings_on_employee_id                  (employee_id)
#  index_employee_trainings_on_employee_id_and_training_id  (employee_id,training_id) UNIQUE
#  index_employee_trainings_on_training_id                  (training_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (training_id => trainings.id)
#
class Employee::EmployeeTraining < ApplicationRecord
  include PgSearchable
  pg_search_config(
    against: [:completed_at],
    associated_against: {
      employee: [:number],
      training: [:name],
    },
  )

  tracked
  resourcify

  belongs_to :employee
  belongs_to :training

  # Ensure an employee can only have one record per training
  validates :training_id, uniqueness: { scope: :employee_id }

  def status
    if completed_at.present?
      :completed
    elsif started_at.present?
      :in_progress
    else
      :not_started
    end
  end

  scope :includes_associated, -> { includes([:employee, :training]) }
end
