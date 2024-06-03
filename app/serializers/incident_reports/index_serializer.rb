class IncidentReports::IndexSerializer < IncidentReportSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
