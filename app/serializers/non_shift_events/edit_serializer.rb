class NonShiftEvents::EditSerializer < NonShiftEventSerializer

  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
