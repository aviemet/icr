# == Schema Information
#
# Table name: permission_groups
#
#  id          :uuid             not null, primary key
#  description :text
#  name        :string
#  permissions :jsonb
#  precedence  :integer
#  slug        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_permission_groups_on_name  (name) UNIQUE
#  index_permission_groups_on_slug  (slug) UNIQUE
#
FactoryBot.define do
  factory :permission_group, class: "Permission::Group" do
    sequence(:name) { |n| "Permission Group #{n}" }
    sequence(:description) { |n| "Description for Permission Group #{n}" }
    permissions { [] }
    sequence(:slug) { |n| "permission-group-#{n}" }
    sequence(:precedence) { |n| n }

    trait :with_allow_permission do
      transient do
        resource { "clients" }
        action { "view" }
        conditions { {} }
      end

      after(:build) do |group, evaluator|
        group.permissions = [{
          "resource" => evaluator.resource,
          "action" => evaluator.action,
          "effect" => "allow",
          "conditions" => evaluator.conditions
        }]
      end
    end

    trait :with_deny_permission do
      transient do
        resource { "clients" }
        action { "view" }
        conditions { {} }
      end

      after(:build) do |group, evaluator|
        group.permissions = [{
          "resource" => evaluator.resource,
          "action" => evaluator.action,
          "effect" => "deny",
          "conditions" => evaluator.conditions
        }]
      end
    end
  end
end
