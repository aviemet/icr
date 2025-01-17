# == Schema Information
#
# Table name: employees_managers
#
#  id          :uuid             not null, primary key
#  ends_at     :date
#  starts_at   :date             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  employee_id :uuid             not null
#  manager_id  :uuid             not null
#
# Indexes
#
#  index_employees_managers_on_employee_id       (employee_id)
#  index_employees_managers_on_manager_id        (manager_id)
#  index_employees_managers_unique_relationship  (manager_id,employee_id) UNIQUE WHERE (ends_at IS NULL)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (manager_id => employees.id)
#
FactoryBot.define do
  factory :employees_manager do
    manager { nil }
    employee { nil }
    starts_at { "2025-01-16" }
    ends_at { "2025-01-16" }
  end
end
