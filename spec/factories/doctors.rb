# == Schema Information
#
# Table name: doctors
#
#  id         :bigint           not null, primary key
#  first_name :string
#  last_name  :string
#  notes      :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
FactoryBot.define do
  factory :doctor do
    first_name { "MyString" }
    last_name { "MyString" }
    notes { "MyText" }
  end
end
