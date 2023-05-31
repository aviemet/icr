FactoryBot.define do
  factory :employee do
    number { Faker::Number.number(digits: 4) }
    person
  end
end
