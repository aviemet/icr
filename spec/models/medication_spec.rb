# == Schema Information
#
# Table name: medications
#
#  id           :bigint           not null, primary key
#  generic_name :string
#  name         :string
#  notes        :text
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
require 'rails_helper'

RSpec.describe Medication, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
