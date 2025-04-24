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
require 'rails_helper'

RSpec.describe Employee::InterviewParticipant, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
