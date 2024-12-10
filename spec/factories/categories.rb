# == Schema Information
#
# Table name: categories
#
#  id                 :uuid             not null, primary key
#  categorizable_type :string           not null
#  description        :text
#  name               :string
#  slug               :string           not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
# Indexes
#
#  index_categories_on_name_and_categorizable_type  (name,categorizable_type) UNIQUE
#  index_categories_on_slug                         (slug) UNIQUE
#
FactoryBot.define do
  factory :category do
    categorizable_type { Category::CATEGORIZABLE_TYPES.sample }
    name { Faker::Commerce.department }
    description { Faker::Lorem.paragraph }
  end
end
