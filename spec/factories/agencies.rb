# == Schema Information
#
# Table name: agencies
#
#  id         :uuid             not null, primary key
#  name       :string           not null
#  settings   :jsonb
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_agencies_on_slug  (slug) UNIQUE
#
FactoryBot.define do
  factory :agency do
    name { Faker::Company.name }
    settings { {} }
  end
end
