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
#  fk_rails_...  (interview_id => interviews.id)
#
class Employee::InterviewNoteSerializer < ApplicationSerializer
  object_as :interview_note, model: "Employee::InterviewNote"

  attributes(
    :note,
    :recommendation,
    :employee_id,
    :interview_id,
  )
end
