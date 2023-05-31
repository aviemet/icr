class Employee < ApplicationRecord
  belongs_to :person, dependent: :destroy
  has_many :shifts, dependent: :destroy
end
