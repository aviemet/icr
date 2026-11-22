# == Schema Information
#
# Table name: requirements
#
#  id                  :uuid             not null, primary key
#  description         :text
#  enforcement         :integer          default("advisory"), not null
#  name                :string
#  scope_type          :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  requirement_type_id :uuid             not null
#  scope_id            :uuid
#
# Indexes
#
#  index_requirements_on_enforcement          (enforcement)
#  index_requirements_on_requirement_type_id  (requirement_type_id)
#  index_requirements_on_scope                (scope_type,scope_id)
#
# Foreign Keys
#
#  fk_rails_...  (requirement_type_id => requirement_types.id)
#
class Requirement::RequirementSerializer < ApplicationSerializer
  object_as :requirement, model: "Requirement::Requirement"

  attributes(
    :name,
    :description,
    :requirement_type_id,
    :scope_type,
    :scope_id,
    :enforcement,
  )
end
