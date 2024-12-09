# == Schema Information
#
# Table name: doctors
#
#  id         :uuid             not null, primary key
#  first_name :string
#  last_name  :string
#  notes      :text
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_doctors_on_slug  (slug) UNIQUE
#
FactoryBot.define do
  factory :doctor do
    first_name { "MyString" }
    last_name { "MyString" }
    notes { "MyText" }
  end
end
