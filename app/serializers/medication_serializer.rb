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
class MedicationSerializer < ApplicationSerializer
  object_as :medication

  attributes(
    :name,
    :generic_name,
    :notes,
  )
end
