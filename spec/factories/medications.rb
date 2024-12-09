# == Schema Information
#
# Table name: medications
#
#  id           :uuid             not null, primary key
#  generic_name :string
#  name         :string
#  notes        :text
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
FactoryBot.define do
  factory :medication do
    name { "MyString" }
    generic_name { "MyString" }
    notes { "MyText" }
  end
end
