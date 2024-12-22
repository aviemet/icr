# == Schema Information
#
# Table name: categories
#
#  id                 :uuid             not null, primary key
#  categorizable_type :string           not null
#  description        :text
#  name               :string           not null
#  slug               :string           not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  parent_id          :uuid
#
# Indexes
#
#  index_categories_on_name_and_categorizable_type  (name,categorizable_type) UNIQUE
#  index_categories_on_parent_id                    (parent_id)
#  index_categories_on_slug                         (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (parent_id => categories.id)
#
FactoryBot.define do
  factory :category do
    name { Faker::Commerce.department }
    description { Faker::Lorem.paragraph }

    categorizable_type { Category::CATEGORIZABLE_TYPES.sample }

    Category::CATEGORIZABLE_TYPES.each do |type|
      trait type.underscore.to_sym do
        categorizable_type { type }
      end
    end
  end
end
