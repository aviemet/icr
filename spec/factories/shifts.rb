# == Schema Information
#
# Table name: shifts
#
#  id                :uuid             not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_entry_id :uuid             not null
#  employee_id       :uuid             not null
#
# Indexes
#
#  index_shifts_on_calendar_entry_id  (calendar_entry_id)
#  index_shifts_on_employee_id        (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_entry_id => calendar_entries.id)
#  fk_rails_...  (employee_id => employees.id)
#
FactoryBot.define do
  factory :shift do
    employee

    trait :with_client do
      clients { [association(:client)] }
    end

    trait :with_household do
      households { [association(:household)] }
    end

    calendar_entry { nil }
  end
end
