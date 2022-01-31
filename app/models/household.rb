class Household < ApplicationRecord
  includes Contactable

  has_and_belongs_to_many :clients, class_name: "Person"
end
