# == Schema Information
#
# Table name: websites
#
#  id          :uuid             not null, primary key
#  name        :string
#  url         :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid             not null
#  contact_id  :uuid
#
# Indexes
#
#  index_websites_on_category_id  (category_id)
#  index_websites_on_contact_id   (contact_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (contact_id => contacts.id)
#
FactoryBot.define do
  factory :website do
    name { Faker::Company.bs.titleize }
    url { Faker::Internet.domain_name }

    contact

    category factory: %i[category website]
  end
end
