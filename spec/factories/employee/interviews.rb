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
FactoryBot.define do
  factory :employee_interview, class: 'Employee::Interview' do
    employee { nil }
    scheduled_at { "2025-04-17 23:11:29" }
    notes { "MyText" }
  end
end
