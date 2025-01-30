class JobTitles::PersistedSerializer < JobTitleSerializer
  include Persisted

  attributes(
    :slug,
  )
end
