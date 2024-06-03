# == Schema Information
#
# Table name: categories
#
#  id                 :bigint           not null, primary key
#  categorizable_type :string           not null
#  description        :text
#  name               :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
# Indexes
#
#  index_categories_on_name_and_categorizable_type  (name,categorizable_type) UNIQUE
#
FactoryBot.define do
  factory :category do
    categorizable_type { Faker::Lorem.word }
    name { Faker::Commerce.department }
    description { Faker::Lorem.paragraph }
  end
end
