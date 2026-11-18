# == Schema Information
#
# Table name: companies
#
#  id         :uuid             not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
FactoryBot.define do
  factory :company do
    name { Faker::Company.name }
  end
end
