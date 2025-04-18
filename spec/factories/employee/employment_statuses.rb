FactoryBot.define do
  factory :employee_employment_status, class: 'Employee::EmploymentStatus' do
    name { "MyString" }
    employee { nil }
    active_at { "2025-04-17 23:03:06" }
    inactive_at { "2025-04-17 23:03:06" }
    notes { "MyText" }
    updated_by { nil }
    category { nil }
    order { 1 }
  end
end
