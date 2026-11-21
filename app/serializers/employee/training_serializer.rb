# == Schema Information
#
# Table name: trainings
#
#  id                :uuid             not null, primary key
#  description       :text
#  estimated_minutes :integer
#  name              :string
#  status            :integer          default("active"), not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
class Employee::TrainingSerializer < ApplicationSerializer
  object_as :training, model: "Employee::Training"

  attributes(
    :name,
    :description,
    :estimated_minutes,
    :status,
  )
end
