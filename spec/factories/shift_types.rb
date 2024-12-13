# == Schema Information
#
# Table name: shift_types
#
#  id         :uuid             not null, primary key
#  name       :string
#  notes      :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
FactoryBot.define do
  factory :shift_type do
    name { Faker::Lorem.word }
  end
end
