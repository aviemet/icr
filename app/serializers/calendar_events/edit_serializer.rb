class CalendarEvents::EditSerializer < CalendarEventSerializer

  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
