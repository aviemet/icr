# == Schema Information
#
# Table name: households
#
#  id         :bigint           not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class HouseholdSerializer < ApplicationSerializer
  object_as :household

  

  attributes(
    :name,
  )
end
