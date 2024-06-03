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
class DoctorSerializer < ApplicationSerializer
  object_as :doctor

  attributes(
    :first_name,
    :last_name,
    :notes,
  )
end
