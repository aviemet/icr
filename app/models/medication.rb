# == Schema Information
#
# Table name: medications
#
#  id           :uuid             not null, primary key
#  generic_name :string
#  name         :string           not null
#  notes        :text
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
class Medication < ApplicationRecord
  resourcify

  has_many :prescriptions, dependent: :nullify

  validates :name, presence: true
end
