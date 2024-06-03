class JobtitleSerializer < ApplicationSerializer
  object_as :jobtitle

  attributes(
    :title,
    :description,
  )
end
