# == Schema Information
#
# Table name: dosages
#
#  id          :bigint           not null, primary key
#  amount      :decimal(, )
#  amount_unit :integer
#  freq_amount :decimal(, )
#  freq_period :integer
#  notes       :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
require 'rails_helper'

RSpec.describe Dosage, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
