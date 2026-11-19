# == Schema Information
#
# Table name: employee_clearances
#
#  id             :uuid             not null, primary key
#  clearance_type :integer          default("tb"), not null
#  cleared_on     :date
#  expires_on     :date
#  notes          :text
#  status         :integer          default("pending"), not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  employee_id    :uuid             not null
#
# Indexes
#
#  index_employee_clearances_on_employee_id  (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#
FactoryBot.define do
  factory :employee_clearance, class: "Employee::Clearance" do
    employee
    clearance_type { :tb }
    status { :cleared }
    cleared_on { Date.current - 10.days }
    expires_on { Date.current + 90.days }
    notes { nil }
  end
end
