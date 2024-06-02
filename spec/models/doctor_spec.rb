# == Schema Information
#
# Table name: doctors
#
#  id         :bigint           not null, primary key
#  first_name :string
#  last_name  :string
#  notes      :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

RSpec.describe Doctor, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
