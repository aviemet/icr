class Employee::InterviewParticipant < ApplicationRecord
  include PgSearchable
  pg_search_config(
    against: [:role, :feedback, :recommendation],
    associated_against: {
      employee: [:number],
      interview: [:scheduled_at, :interview_type]
    },
  )

  tracked
  resourcify

  belongs_to :interview, class_name: "Employee::Interview"
  belongs_to :person

  validates :role, presence: true
  validates :recommendation, presence: true, if: :feedback_present?

  scope :includes_associated, -> { includes([:employee, :interview]) }

  private

  def feedback_present?
    feedback.present?
  end
end
