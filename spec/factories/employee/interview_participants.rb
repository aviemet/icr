FactoryBot.define do
  factory :employee_interview_participant, class: 'Employee::InterviewParticipant' do
    person { nil }
    employee_interview { nil }
    notes { "MyText" }
  end
end
