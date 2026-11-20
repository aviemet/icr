require "rails_helper"
require_relative "../support/devise"

RSpec.describe "Interview notes" do
  login_user(:admin)

  let(:employee) { create(:employee) }
  let(:interview) { create(:interview, employee: employee) }

  it "creates a note on an interview" do
    expect {
      post interview_interview_notes_url(interview), params: {
        interview_note: {
          note: "Strong communicator",
          recommendation: "strong_yes",
          employee_id: employee.id,
        },
      }
    }.to change(Employee::InterviewNote, :count).by(1)

    expect(response).to redirect_to(interview_url(interview))
    note = Employee::InterviewNote.last
    expect(note.note).to eq("Strong communicator")
    expect(note).to be_strong_yes
    expect(note.interview).to eq(interview)
  end
end
