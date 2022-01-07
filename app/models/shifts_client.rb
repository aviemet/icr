class ShiftsClient < ApplicationRecord
  belongs_to :shift
  belongs_to :client
end
