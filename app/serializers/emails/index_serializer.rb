class Emails::IndexSerializer < EmailSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
