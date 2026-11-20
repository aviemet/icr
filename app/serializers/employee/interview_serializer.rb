# == Schema Information
#
# Table name: interviews
#
#  id             :uuid             not null, primary key
#  interview_type :string
#  location       :string
#  notes          :text
#  scheduled_at   :datetime
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  employee_id    :uuid             not null
#
# Indexes
#
#  index_interviews_on_employee_id  (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#
class Employee::InterviewSerializer < ApplicationSerializer
  object_as :employee_interview, model: "Employee::Interview"

  attributes(:scheduled_at, :notes, :employee_id, :location, :interview_type)

  has_many :interview_notes, serializer: Employee::InterviewNotes::PersistedSerializer
end
