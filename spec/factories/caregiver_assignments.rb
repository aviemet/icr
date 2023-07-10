FactoryBot.define do
  factory :caregiver_assignment do
    client { nil }
    employee_belongs_to { "MyString" }
  end
end
