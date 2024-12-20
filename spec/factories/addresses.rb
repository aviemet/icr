# == Schema Information
#
# Table name: addresses
#
#  id          :uuid             not null, primary key
#  address     :string           not null
#  address_2   :string
#  city        :string
#  country     :integer
#  name        :string
#  notes       :text
#  postal      :string
#  region      :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid             not null
#  contact_id  :uuid
#
# Indexes
#
#  index_addresses_on_category_id  (category_id)
#  index_addresses_on_contact_id   (contact_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (contact_id => contacts.id)
#
FactoryBot.define do
  factory :address do
    name { Faker::Address.community }
    address { Faker::Address.street_address }
    address_2 { Faker::Address.secondary_address }
    city { Faker::Address.city }
    region { Faker::Address.state }
    country { "US" }
    postal { Faker::Address.zip_code }
    notes { Faker::Lorem.sentence }

    contact

    category factory: %i[category address]
  end
end
