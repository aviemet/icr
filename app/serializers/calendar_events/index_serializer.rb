class CalendarEvents::IndexSerializer < CalendarEventSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
