class RecurringPattern < ApplicationRecord
  belongs_to :shift

	enum recurring_type: {
		daily: 10,
		weekly: 20,
		yearly: 30
	}
end
