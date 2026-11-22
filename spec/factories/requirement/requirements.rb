# == Schema Information
#
# Table name: requirements
#
#  id                  :uuid             not null, primary key
#  description         :text
#  enforcement         :integer          default("advisory"), not null
#  name                :string
#  scope_type          :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  requirement_type_id :uuid             not null
#  scope_id            :uuid
#
# Indexes
#
#  index_requirements_on_enforcement          (enforcement)
#  index_requirements_on_requirement_type_id  (requirement_type_id)
#  index_requirements_on_scope                (scope_type,scope_id)
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
    scope { nil }
    enforcement { :advisory }

    trait :for_job_title do
      scope { association :job_title }
    end

    trait :for_client do
      scope { association :client }
      enforcement { :client_schedule }
    end

    trait :employment do
      enforcement { :employment }
    end
  end
end
