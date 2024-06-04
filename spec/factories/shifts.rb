# == Schema Information
#
# Table name: shifts
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  employee_id :bigint           not null
#
# Indexes
#
#  index_shifts_on_employee_id  (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#
FactoryBot.define do
  factory :shift do
    calendar_event
    employee

    trait :with_client do
      clients { [association(:client)] }
    end

    trait :with_household do
      households { [association(:household)] }
    end
  end
end
