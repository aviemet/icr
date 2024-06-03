class IncidentReports::ShowSerializer < IncidentReportSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
