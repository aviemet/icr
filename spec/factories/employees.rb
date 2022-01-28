FactoryBot.define do
  factory :employee do
    f_name { Faker::Name.first_name }
    m_name { Faker::Name.middle_name }
    l_name { Faker::Name.last_name }
  end
end
