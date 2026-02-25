# == Schema Information
#
# Table name: requirements
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
#  index_requirements_on_requirement_type_id  (requirement_type_id)
#
# Foreign Keys
#
#  fk_rails_...  (requirement_type_id => requirement_types.id)
#
class Requirement::RequirementSerializer < ::ApplicationSerializer
  object_as :requirement

  attributes(
    :name,
    :description,
    :requirement_type_id,
    :scope_type,
    :scope_id,
  )
end
