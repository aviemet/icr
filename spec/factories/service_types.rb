# == Schema Information
#
# Table name: service_types
#
#  id                  :uuid             not null, primary key
#  active              :boolean          default(TRUE), not null
#  allows_multi_client :boolean          default(FALSE), not null
#  assignable          :boolean          default(TRUE), not null
#  billable            :boolean          default(TRUE), not null
#  color               :string           default("#2F6FED"), not null
#  name                :string           not null
#  payable             :boolean          default(TRUE), not null
#  position            :integer          default(0), not null
#  requires_notes      :boolean          default(FALSE), not null
#  slug                :string           not null
#  system              :boolean          default(FALSE), not null
#  tracks_mileage      :boolean          default(FALSE), not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
# Indexes
#
#  index_service_types_on_active    (active)
#  index_service_types_on_name      (name) UNIQUE
#  index_service_types_on_position  (position)
#  index_service_types_on_slug      (slug) UNIQUE
#
FactoryBot.define do
  factory :service_type do
    sequence(:name) { |index| "Service Type #{index}" }
    active { true }
    assignable { true }
    system { false }
    position { 0 }
    billable { true }
    payable { true }
    allows_multi_client { false }
    requires_notes { false }
    tracks_mileage { false }
    color { "#2F6FED" }

    trait :system do
      system { true }
      initialize_with {
        ServiceType.find_or_create_by!(name: "Regular") do |row|
          row.system = true
          row.active = true
          row.assignable = true
          row.billable = true
          row.payable = true
          row.color = "#2F6FED"
          row.position = 0
        end
      }
    end

    trait :multi_client do
      allows_multi_client { true }
    end

    trait :notes_required do
      requires_notes { true }
    end
  end
end
