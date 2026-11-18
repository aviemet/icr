# == Schema Information
#
# Table name: departments
#
#  id          :uuid             not null, primary key
#  description :text
#  name        :string           not null
#  slug        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_departments_on_slug  (slug) UNIQUE
#
FactoryBot.define do
  factory :department, class: "Employee::Department" do
    sequence(:name) { |n| "#{Faker::Commerce.department} #{n}" }
    description { Faker::Lorem.sentence }
  end
end
