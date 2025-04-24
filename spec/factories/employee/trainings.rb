# == Schema Information
#
# Table name: trainings
#
#  id                :uuid             not null, primary key
#  active_on         :datetime
#  description       :text
#  estimated_minutes :integer
#  inactive_on       :datetime
#  name              :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
FactoryBot.define do
  factory :training, class: "Employee::Training" do
    name { "#{Faker::Company.buzzword.titleize} Training" }
    description { Faker::Company.bs.capitalize }
    estimated_minutes { 120 }
    active_on { 1.month.ago }
    inactive_on { 1.month.from_now }
  end
end
