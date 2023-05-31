class Person < ApplicationRecord
  include Contactable

  has_one :user, required: false
  has_one :employee, required: false
  has_one :client, required: false

  validates :first_name, presence: true
  validates :last_name, presence: true

  def name
    "#{first_name} #{last_name}"
  end
end
