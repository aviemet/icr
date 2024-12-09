# == Schema Information
#
# Table name: vendors
#
#  id          :uuid             not null, primary key
#  name        :string
#  notes       :text
#  slug        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid             not null
#
# Indexes
#
#  index_vendors_on_category_id  (category_id)
#  index_vendors_on_slug         (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#
FactoryBot.define do
  factory :vendor do
    category { nil }
    name { "MyString" }
    notes { "MyText" }
  end
end
