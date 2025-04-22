class Employee::JobTitles::PersistedSerializer < Employee::JobTitleSerializer
  include Persisted

  attributes(
    :slug,
  )
end
