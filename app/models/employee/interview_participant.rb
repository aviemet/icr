# == Schema Information
#
# Table name: interview_participants
#
#  id           :uuid             not null, primary key
#  notes        :text
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  interview_id :uuid             not null
#  person_id    :uuid             not null
#
# Indexes
#
#  index_interview_participants_on_interview_id  (interview_id)
#  index_interview_participants_on_person_id     (person_id)
#
# Foreign Keys
#
#  fk_rails_...  (interview_id => interviews.id)
#  fk_rails_...  (person_id => people.id)
#
class Employee::InterviewParticipant < ApplicationRecord
  self.table_name = "interview_participants"

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
