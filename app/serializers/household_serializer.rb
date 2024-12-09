# == Schema Information
#
# Table name: households
#
#  id         :uuid             not null, primary key
#  name       :string
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_households_on_slug  (slug) UNIQUE
#
class HouseholdSerializer < ApplicationSerializer
  object_as :household

  

  attributes(
    :name,
  )
end
