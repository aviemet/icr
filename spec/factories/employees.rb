# == Schema Information
#
# Table name: employees
#
#  id          :bigint           not null, primary key
#  active_at   :date
#  inactive_at :date
#  number      :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  person_id   :bigint           not null
#
# Indexes
#
#  index_employees_on_person_id  (person_id)
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
FactoryBot.define do
  factory :employee do
    active_at { Faker::Date.backward(days: 30) }
    number { Faker::Alphanumeric.alpha(number: 8).upcase }

    person
  end
end
