class JobTitles::ShowSerializer < JobTitleSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
