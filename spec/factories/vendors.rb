# == Schema Information
#
# Table name: vendors
#
#  id          :bigint           not null, primary key
#  name        :string
#  notes       :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :bigint           not null
#
# Indexes
#
#  index_vendors_on_category_id  (category_id)
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
