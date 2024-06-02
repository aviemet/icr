# == Schema Information
#
# Table name: incident_types
#
#  id          :bigint           not null, primary key
#  name        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :bigint           not null
#
# Indexes
#
#  index_incident_types_on_category_id  (category_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#
class IncidentType < ApplicationRecord

  pg_search_scope(
    :search,
    against: [:category, :name],
    associated_against: {
      category: [],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  belongs_to :category

  scope :includes_associated, -> { includes([:category]) }
end
