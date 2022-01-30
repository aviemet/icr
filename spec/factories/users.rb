FactoryBot.define do
  factory :user do
    email { Faker::Internet.email }
		password { Faker::Internet.password }
		confirmed_at { Date.new }
		time_zone { "America/Los_Angeles" }
  end
end
