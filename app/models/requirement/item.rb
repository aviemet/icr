# == Schema Information
#
# Table name: requirement_items
#
#  id               :uuid             not null, primary key
#  fulfillable_type :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  fulfillable_id   :uuid             not null
#  requirement_id   :uuid             not null
#
# Indexes
#
#  index_req_items_on_req_fulfillable_unique  (requirement_id,fulfillable_type,fulfillable_id) UNIQUE
#  index_requirement_items_on_fulfillable     (fulfillable_type,fulfillable_id)
#  index_requirement_items_on_requirement_id  (requirement_id)
#
# Foreign Keys
#
#  fk_rails_...  (requirement_id => requirements.id)
#
module Requirement
  class Item < ApplicationRecord
    include PgSearchable
    pg_search_config(
      against: [:requirement, :fulfillable],
      associated_against: {
        requirement: [],
        fulfillable: [],
      },
    )

    tracked
    resourcify

    belongs_to :requirement, class_name: "Requirement::Requirement"
    belongs_to :fulfillable, polymorphic: true

    scope :includes_associated, -> { includes([:requirement, :fulfillable]) }

    # Add validation to ensure uniqueness of fulfillable item per requirement
    validates :fulfillable_id, uniqueness: { scope: [:requirement_id, :fulfillable_type] }
  end
end
