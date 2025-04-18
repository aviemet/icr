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
require 'rails_helper'

RSpec.describe Requirement::Requirement, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
