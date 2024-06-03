class JobTitles::IndexSerializer < JobTitleSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
