# == Schema Information
#
# Table name: trainings
#
#  id                :uuid             not null, primary key
#  active_on         :datetime
#  description       :text
#  estimated_minutes :integer
#  inactive_on       :datetime
#  name              :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
class TrainingSerializer < ApplicationSerializer
  object_as :training
  
  attributes(
    :name,
    :description,
    :estimated_minutes,
    :active_on,
    :inactive_on,
  )
end
