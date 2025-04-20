# == Schema Information
#
# Table name: interview_notes
#
#  id             :uuid             not null, primary key
#  note           :text
#  recommendation :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  employee_id    :uuid             not null
#  interview_id   :uuid             not null
#
# Indexes
#
#  index_interview_notes_on_employee_id   (employee_id)
#  index_interview_notes_on_interview_id  (interview_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (interview_id => employees.id)
#
class Employee::InterviewNote < ApplicationRecord
  self.table_name = "interview_notes"

  include PgSearchable
  pg_search_config(
    against: [:employee, :note, :interview, :recommendation],
    associated_against: {
      employee: [],
      interview: [],
    },
  )

  tracked
  resourcify

  belongs_to :employee
  belongs_to :interview

  scope :includes_associated, -> { includes([:employee, :interview]) }
end
