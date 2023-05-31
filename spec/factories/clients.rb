FactoryBot.define do
  factory :client do
    number { Faker::Number.number(digits: 4) }
    person
  end
end
