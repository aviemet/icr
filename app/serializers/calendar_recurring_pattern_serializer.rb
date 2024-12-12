class CalendarRecurringPatternSerializer < ApplicationSerializer
  object_as :calendar_recurring_pattern

  attributes(
    :recurring_type,
    :offset,
    :max_occurrences,
    :end_date,
    :day_of_week,
    :week_of_month,
    :day_of_month,
    :month_of_year,
  )
end
