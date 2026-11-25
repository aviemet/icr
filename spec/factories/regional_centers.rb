# == Schema Information
#
# Table name: regional_centers
#
#  id         :uuid             not null, primary key
#  active     :boolean          default(TRUE), not null
#  code       :string           not null
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_regional_centers_on_active  (active)
#  index_regional_centers_on_code    (code) UNIQUE
#
FactoryBot.define do
  factory :regional_center do
    sequence(:code) { |number| "rc#{number}" }
    sequence(:name) { |number| "Regional Center #{number}" }
    active { true }
  end
end
