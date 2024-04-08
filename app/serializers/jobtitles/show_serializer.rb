class Jobtitles::ShowSerializer < JobtitleSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
