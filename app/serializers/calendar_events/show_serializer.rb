class CalendarEvents::ShowSerializer < CalendarEventSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
