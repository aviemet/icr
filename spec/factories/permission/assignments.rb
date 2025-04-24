# == Schema Information
#
# Table name: permission_assignments
#
#  id                  :uuid             not null, primary key
#  conditions          :jsonb
#  ends_at             :datetime
#  permissionable_type :string           not null
#  starts_at           :datetime
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  permission_group_id :uuid             not null
#  permissionable_id   :uuid             not null
#
# Indexes
#
#  index_permission_assignments_on_permission_group_id  (permission_group_id)
#  index_permission_assignments_on_permissionable       (permissionable_type,permissionable_id)
#
# Foreign Keys
#
#  fk_rails_...  (permission_group_id => permission_groups.id)
#
FactoryBot.define do
  factory :permission_assignment, class: "Permission::Assignment" do
    group factory: %i[permission_group]
    permissionable factory: %i[user]
    starts_at { Time.current }
    ends_at { 1.year.from_now }
    conditions { {} }

    trait :expired do
      starts_at { 2.years.ago }
      ends_at { 1.year.ago }
    end

    trait :future do
      starts_at { 1.year.from_now }
      ends_at { 2.years.from_now }
    end

    trait :for_user do
      permissionable factory: %i[user]
    end

    trait :for_job_title do
      permissionable factory: %i[employee_job_title]
    end
  end
end
