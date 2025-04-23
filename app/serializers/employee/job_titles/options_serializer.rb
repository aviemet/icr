class Employee::JobTitles::OptionsSerializer < ApplicationSerializer
  object_as :job_title, model: "Employee::JobTitle"

  include Persisted

  attributes(
    :slug,
    :name,
  )
end
