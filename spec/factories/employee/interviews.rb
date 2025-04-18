FactoryBot.define do
  factory :employee_interview, class: 'Employee::Interview' do
    employee { nil }
    scheduled_at { "2025-04-17 23:11:29" }
    notes { "MyText" }
  end
end
