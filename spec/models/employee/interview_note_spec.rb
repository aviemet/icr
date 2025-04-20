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
require 'rails_helper'

RSpec.describe Employee::InterviewNote, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
