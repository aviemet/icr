class Employee < ApplicationRecord
  belongs_to :person, dependent: :destroy
  has_many :shifts, dependent: :destroy
  has_many :caregiver_assignments
  has_many :clients, through: :caregiver_assignments

  scope :includes_associated, -> { includes(:person, :clients) }
end
