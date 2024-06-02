# == Schema Information
#
# Table name: households
#
#  id         :bigint           not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
FactoryBot.define do
  factory :household do
    name { "#{Faker::Name.last_name} & #{Faker::Name.last_name}" }
  end
end
