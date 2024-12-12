class NonShiftEvents::IndexSerializer < NonShiftEventSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
