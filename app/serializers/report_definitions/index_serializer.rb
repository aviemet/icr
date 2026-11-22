# frozen_string_literal: true

class ReportDefinitions::IndexSerializer < ReportDefinitionSerializer
  attributes(
    :id,
    :created_at,
    :updated_at,
  )
end
