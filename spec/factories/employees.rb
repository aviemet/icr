FactoryBot.define do
  factory :employee do
    number { Faker::Number.number(digits: 4) }
    settings { { shift_color: Faker::Color.hex_color } }
    person
  end
end
