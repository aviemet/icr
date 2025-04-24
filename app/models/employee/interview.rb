# == Schema Information
#
# Table name: interviews
#
#  id           :uuid             not null, primary key
#  notes        :text
#  scheduled_at :datetime
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  employee_id  :uuid             not null
#
# Indexes
#
#  index_interviews_on_employee_id  (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#
class Employee::Interview < ApplicationRecord
  self.table_name = "interviews"

  include PgSearchable
  pg_search_config(
    against: [:scheduled_at, :location, :interview_type, :notes],
    associated_against: {
      employee: [:number],
      interviewers: [:number],
    },
  )

  tracked
  resourcify

  belongs_to :employee # Interviewee
  has_many :interview_participants, class_name: "Employee::InterviewParticipant", dependent: :destroy
  has_many :interviewers, through: :interview_participants, source: :person

  scope :includes_associated, -> { includes([:employee, :interviewers]) }
  scope :upcoming, -> { where("scheduled_at > ?", Time.current) }
  scope :past, -> { where(scheduled_at: ..Time.current) }
end
