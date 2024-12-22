class JobTitles::EditSerializer < JobTitleSerializer

  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
