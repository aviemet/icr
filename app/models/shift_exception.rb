class ShiftException < ApplicationRecord
  belongs_to :shift, dependent: :destroy
end
