class RecurringPatterns::FormDataSerializer < ApplicationSerializer
  object_as :recurring_pattern

  attributes(
    :recurring_type,
    :offset,
    :max_occurrences,
    :end_date,
    :day_of_week,
    :day_of_month,
    :week_of_month,
    :month_of_year,
  )
end
