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
require "rails_helper"

RSpec.describe Employee::InterviewParticipant do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:interview_participant)).to be_valid
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:interview).class_name("Employee::Interview") }
    it { is_expected.to belong_to(:person) }
  end
end
