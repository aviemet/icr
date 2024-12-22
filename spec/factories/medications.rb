# == Schema Information
#
# Table name: medications
#
#  id           :uuid             not null, primary key
#  generic_name :string
#  name         :string           not null
#  notes        :text
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
FactoryBot.define do
  factory :medication do
    name { Faker::Science.element + Faker::Alphanumeric.alpha(number: 3).capitalize }
  end
end
