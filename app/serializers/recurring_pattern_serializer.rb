# == Schema Information
#
# Table name: recurring_patterns
#
#  id             :uuid             not null, primary key
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
class RecurringPatternSerializer < ApplicationSerializer
  object_as :recurring_pattern

  attributes(
    :recurring_type,
    :offset,
    :max_occurances,
    :end_date,
    :day_of_week,
    :week_of_month,
    :day_of_month,
    :month_of_year,
  )
end
