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
  factory :training do
    name { "MyString" }
    description { "MyText" }
    estimated_minutes { 1 }
    active_on { "2025-04-17 16:22:39" }
    inactive_on { "2025-04-17 16:22:39" }
  end
end
