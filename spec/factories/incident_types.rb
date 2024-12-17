# == Schema Information
#
# Table name: incident_types
#
#  id          :uuid             not null, primary key
#  name        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid
#
# Indexes
#
#  index_incident_types_on_category_id  (category_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#
FactoryBot.define do
  factory :incident_type do
    name { Faker::Commerce.department(max: 1) }

    category factory: %i[category incident_report]
  end
end
