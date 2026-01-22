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
require "rails_helper"

RSpec.describe Employee::InterviewNote do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:interview_note)).to be_valid
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:employee) }
    it { is_expected.to belong_to(:interview).class_name("Employee::Interview") }
  end
end
