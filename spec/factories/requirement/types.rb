# == Schema Information
#
# Table name: requirement_types
#
#  id          :uuid             not null, primary key
#  description :text
#  name        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
FactoryBot.define do
  factory :requirement_type, class: 'Requirement::Type' do
    name { "MyString" }
    description { "MyText" }
    code { "MyString" }
  end
end
