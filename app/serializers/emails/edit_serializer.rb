class Emails::EditSerializer < EmailSerializer

  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
