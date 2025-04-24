# == Schema Information
#
# Table name: employment_statuses
#
#  id            :uuid             not null, primary key
#  active_at     :datetime
#  inactive_at   :datetime
#  name          :string
#  notes         :text
#  order         :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  employee_id   :uuid             not null
#  updated_by_id :uuid             not null
#
# Indexes
#
#  index_employment_statuses_on_employee_id    (employee_id)
#  index_employment_statuses_on_updated_by_id  (updated_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (updated_by_id => users.id)
#
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
