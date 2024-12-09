# == Schema Information
#
# Table name: shift_types
#
#  id         :uuid             not null, primary key
#  notes      :text
#  title      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
FactoryBot.define do
  factory :shift_type do
    title { "MyString" }
    notes { "MyText" }
  end
end
