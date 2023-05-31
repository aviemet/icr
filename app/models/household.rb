class Household < ApplicationRecord
  includes Contactable

  has_many :household_members
  has_many :clients, through: :household_members
  has_many :employees, through: :household_members
end
