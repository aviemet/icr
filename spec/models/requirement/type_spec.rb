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
require 'rails_helper'

RSpec.describe Requirement::Type, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
