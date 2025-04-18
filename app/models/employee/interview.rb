class Employee::Interview < ApplicationRecord
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
