# == Schema Information
#
# Table name: households
#
#  id         :uuid             not null, primary key
#  name       :string           not null
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_households_on_slug  (slug) UNIQUE
#
class HouseholdSerializer < ApplicationSerializer
  identifier :slug

  attributes(
    :name,
  )

  has_many :clients, serializer: Clients::PersistedSerializer
end
