# == Schema Information
#
# Table name: requirement_items
#
#  id               :uuid             not null, primary key
#  credential_type  :integer
#  fulfillable_type :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  fulfillable_id   :uuid
#  requirement_id   :uuid             not null
#
# Indexes
#
#  index_req_items_on_req_credential_type_unique  (requirement_id,credential_type) UNIQUE WHERE (credential_type IS NOT NULL)
#  index_req_items_on_req_fulfillable_unique      (requirement_id,fulfillable_type,fulfillable_id) UNIQUE WHERE (fulfillable_id IS NOT NULL)
#  index_requirement_items_on_fulfillable         (fulfillable_type,fulfillable_id)
#  index_requirement_items_on_requirement_id      (requirement_id)
#
# Foreign Keys
#
#  fk_rails_...  (requirement_id => requirements.id)
#
FactoryBot.define do
  factory :requirement_item, class: "Requirement::Item" do
    requirement
    fulfillable { association :training }

    trait :credential do
      fulfillable { nil }
      fulfillable_type { nil }
      fulfillable_id { nil }
      credential_type { :drivers_license }
    end
  end
end
