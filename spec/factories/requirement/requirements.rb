# == Schema Information
#
# Table name: requirements
#
#  id                  :uuid             not null, primary key
#  description         :text
#  name                :string
#  scope_type          :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  requirement_type_id :uuid             not null
#  scope_id            :integer
#
# Indexes
#
#  index_requirements_on_requirement_type_id  (requirement_type_id)
#
# Foreign Keys
#
#  fk_rails_...  (requirement_type_id => requirement_types.id)
#
FactoryBot.define do
  factory :requirement_requirement, class: "Requirement::Requirement", aliases: [:requirement] do
    name { Faker::Company.buzzword.titleize }
    description { Faker::Lorem.paragraph }
    requirement_type
    scope { association :job_title }
  end
end
