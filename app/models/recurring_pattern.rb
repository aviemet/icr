# == Schema Information
#
# Table name: recurring_patterns
#
#  id             :bigint           not null, primary key
#  day_of_month   :integer
#  day_of_week    :integer
#  end_date       :integer
#  max_occurances :integer
#  month_of_year  :integer
#  offset         :integer          default(1), not null
#  recurring_type :integer          not null
#  week_of_month  :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#
class RecurringPattern < ApplicationRecord
  include PgSearch::Model
  include PublicActivity::Model

  has_one :shift, dependent: :destroy

  enum recurring_type: {
    daily: 10,
    weekly: 20,
    monthly: 30,
    yearly: 40,
  }
end
