# == Schema Information
#
# Table name: requirement_requirements
#
#  id                  :uuid             not null, primary key
#  description         :text
#  name                :string
#  scope_type          :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  requirement_type_id :uuid             not null
#  scope_id            :integer
#
# Indexes
#
#  index_requirement_requirements_on_requirement_type_id  (requirement_type_id)
#
# Foreign Keys
#
#  fk_rails_...  (requirement_type_id => requirement_types.id)
#
module Requirement
  class Requirement < ApplicationRecord
    belongs_to :requirement_type, class_name: "Requirement::Type"
    belongs_to :scope, polymorphic: true, optional: true

    has_many :requirement_items, class_name: "Requirement::Item", dependent: :destroy, inverse_of: :requirement

    # Define specific fulfillable types for easier access
    has_many :trainings,
             through: :requirement_items,
             source: :fulfillable,
             source_type: "Training"
    # Add has_many for other fulfillable types (e.g., :credentials) here as needed

    validates :name, presence: true
    # Add validation maybe to ensure scope is present if requirement_type dictates it? Needs more context.
  end
end
