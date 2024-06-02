# == Schema Information
#
# Table name: shift_types
#
#  id         :bigint           not null, primary key
#  notes      :text
#  title      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

RSpec.describe ShiftType, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
