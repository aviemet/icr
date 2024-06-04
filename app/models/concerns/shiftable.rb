module Shiftable
  extend ActiveSupport::Concern

  included do
    has_many :shifts_shiftables, as: :shiftable, dependent: :nullify
    has_many :shifts, through: :shifts_shiftables
  end
end
