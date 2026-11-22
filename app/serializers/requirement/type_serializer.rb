# == Schema Information
#
# Table name: requirement_types
#
#  id          :uuid             not null, primary key
#  description :text
#  name        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
class Requirement::TypeSerializer < ApplicationSerializer
  object_as :requirement_type, model: "Requirement::Type"

  attributes(
    :name,
    :description,
  )
end
