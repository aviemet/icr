# == Schema Information
#
# Table name: shifts
#
#  id                   :bigint           not null, primary key
#  ends_at              :datetime
#  starts_at            :datetime
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  created_by_id        :bigint           not null
#  employee_id          :bigint
#  parent_id            :bigint
#  recurring_pattern_id :bigint
#
# Indexes
#
#  index_shifts_on_created_by_id         (created_by_id)
#  index_shifts_on_employee_id           (employee_id)
#  index_shifts_on_parent_id             (parent_id)
#  index_shifts_on_recurring_pattern_id  (recurring_pattern_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (employee_id => people.id)
#  fk_rails_...  (parent_id => shifts.id)
#  fk_rails_...  (recurring_pattern_id => recurring_patterns.id)
#
now = Time.zone.now

FactoryBot.define do
  sequence :start_time do |n|
    Time.zone.local(now.year, now.month, now.day, n + 10)
  end

  sequence :end_time do |n|
    Time.zone.local(now.year, now.month, now.day, n + 11)
  end

  factory :shift do |_time|
    starts_at { generate(:start_time) }
    ends_at { generate(:end_time) }
    created_by { User.first }
    employee { Employee.first }
    clients { [Client.first] }
  end
end
