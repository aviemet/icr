class Emails::ShowSerializer < EmailSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
