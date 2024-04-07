# == Schema Information
#
# Table name: households
#
#  id         :bigint           not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Household < ApplicationRecord
  includes Contactable

  has_and_belongs_to_many :clients, class_name: "Person"
end
