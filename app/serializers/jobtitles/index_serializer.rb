class Jobtitles::IndexSerializer < JobtitleSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
