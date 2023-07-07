class Employee < ApplicationRecord
  belongs_to :person, dependent: :destroy
  has_many :shifts, dependent: :destroy

  scope :includes_associated, -> { includes(:person) }
end
