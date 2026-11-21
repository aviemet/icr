# == Schema Information
#
# Table name: trainings
#
#  id                :uuid             not null, primary key
#  description       :text
#  estimated_minutes :integer
#  name              :string
#  status            :integer          default("active"), not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
FactoryBot.define do
  factory :training, class: "Employee::Training" do
    name { "#{Faker::Company.buzzword.titleize} Training" }
    description { Faker::Company.bs.capitalize }
    estimated_minutes { 120 }
    status { :active }
  end
end
