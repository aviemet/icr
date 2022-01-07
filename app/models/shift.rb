class Shift < ApplicationRecord
  belongs_to :staff
  has_and_belongs_to_many :clients
end
