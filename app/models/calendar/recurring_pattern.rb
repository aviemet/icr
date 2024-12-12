# == Schema Information
#
# Table name: calendar_recurring_patterns
#
#  id              :uuid             not null, primary key
#  day_of_month    :integer
#  day_of_week     :integer
#  end_date        :integer
#  max_occurrences :integer
#  month_of_year   :integer
#  offset          :integer          default(1), not null
#  recurring_type  :integer          not null
#  week_of_month   :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
class Calendar::RecurringPattern < ApplicationRecord
  enum :recurring_type, {
    daily: 0,
    weekly: 1,
    monthly: 2,
    yearly: 3,
  }

  resourcify

  has_one :calendar_entry, dependent: :nullify
end
