class RecurringPattern < ApplicationRecord
  has_one :shift, dependent: :destroy

  enum recurring_type: {
    daily: 10,
    weekly: 20,
    monthly: 30,
    yearly: 40,
  }
end
