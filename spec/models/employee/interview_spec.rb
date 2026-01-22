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
require "rails_helper"

RSpec.describe Employee::Interview do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:interview)).to be_valid
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:employee) }
    it { is_expected.to have_many(:interview_participants).class_name("Employee::InterviewParticipant").dependent(:destroy) }
    it { is_expected.to have_many(:interviewers).through(:interview_participants).source(:person) }
  end
end
